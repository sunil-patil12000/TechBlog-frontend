#!/usr/bin/env node

/**
 * Structured Data Validator Script
 * 
 * This script validates JSON-LD structured data against Google's Schema.org requirements.
 * It helps ensure your schemas are correctly formatted for rich search results.
 * 
 * Features:
 * - Validates against Schema.org specifications
 * - Tests against Google's Rich Results Test API
 * - Checks multiple schema types (Article, Event, Product, FAQ, etc.)
 * - Provides detailed error messages and fix suggestions
 * 
 * Usage:
 * npm run seo:validate-schema -- --url=https://yourdomain.com
 * npm run seo:validate-schema -- --file=path/to/sample.json
 * npm run seo:validate-schema -- --dir=public --ext=html
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const glob = promisify(require('glob'));
const chalk = require('chalk');
const ora = require('ora');
const axios = require('axios');
const cheerio = require('cheerio');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');
const open = require('open');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('url', {
    description: 'URL to validate',
    type: 'string',
  })
  .option('file', {
    description: 'File path to validate',
    type: 'string',
  })
  .option('dir', {
    description: 'Directory to scan for HTML/JSON files',
    type: 'string',
  })
  .option('ext', {
    description: 'File extensions to scan (html,json)',
    type: 'string',
    default: 'html,json',
  })
  .option('schema', {
    description: 'Specific schema type to validate (Article,Event,Product,FAQ,BreadcrumbList)',
    type: 'string',
  })
  .option('google-test', {
    description: 'Test with Google Rich Results Test API',
    type: 'boolean',
    default: false,
  })
  .option('verbose', {
    description: 'Show detailed validation information',
    type: 'boolean',
    default: false,
  })
  .option('fix', {
    description: 'Attempt to fix common issues automatically',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h')
  .argv;

// Schema.org context URL
const SCHEMA_CONTEXT = 'https://schema.org';

// Initialize the validator
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  validateFormats: true,
});
addFormats(ajv);

// Google Rich Results Test API URL
const GOOGLE_RICH_RESULTS_API = 'https://search.google.com/test/rich-results/result';

// Common schema types and their required/recommended properties
const schemaSpecs = {
  Article: {
    required: ['headline', 'author', 'datePublished', 'publisher'],
    recommended: ['image', 'dateModified', 'articleBody', 'description'],
    expectedType: {
      headline: 'string',
      author: 'object|array',
      datePublished: 'string:date-time',
      publisher: 'object',
      image: 'string|object',
      dateModified: 'string:date-time',
      articleBody: 'string',
      description: 'string',
    },
  },
  BlogPosting: {
    required: ['headline', 'author', 'datePublished', 'publisher'],
    recommended: ['image', 'dateModified', 'articleBody', 'description'],
    expectedType: {
      headline: 'string',
      author: 'object|array',
      datePublished: 'string:date-time',
      publisher: 'object',
      image: 'string|object',
      dateModified: 'string:date-time',
      articleBody: 'string',
      description: 'string',
    },
  },
  Event: {
    required: ['name', 'startDate', 'location'],
    recommended: ['image', 'description', 'endDate', 'offers', 'performer'],
    expectedType: {
      name: 'string',
      startDate: 'string:date-time',
      location: 'object',
      image: 'string|object',
      description: 'string',
      endDate: 'string:date-time',
      offers: 'object|array',
      performer: 'object|array',
    },
  },
  Product: {
    required: ['name'],
    recommended: ['image', 'description', 'offers', 'brand', 'aggregateRating', 'review'],
    expectedType: {
      name: 'string',
      image: 'string|object|array',
      description: 'string',
      offers: 'object|array',
      brand: 'object',
      aggregateRating: 'object',
      review: 'object|array',
    },
  },
  FAQPage: {
    required: ['mainEntity'],
    recommendedInMainEntity: ['name', 'acceptedAnswer'],
    expectedType: {
      mainEntity: 'array',
    },
    expectedInMainEntity: {
      '@type': 'string',
      name: 'string',
      acceptedAnswer: 'object',
    },
  },
  BreadcrumbList: {
    required: ['itemListElement'],
    recommendedInItemListElement: ['position', 'item'],
    expectedType: {
      itemListElement: 'array',
    },
    expectedInItemListElement: {
      '@type': 'string',
      position: 'number',
      name: 'string',
      item: 'string|object',
    },
  },
};

/**
 * Main function to run the schema validation
 */
async function main() {
  console.log(chalk.blue.bold('🔍 Structured Data Validator'));
  console.log(chalk.blue('Validating JSON-LD schema against Schema.org requirements'));
  
  let schemas = [];
  
  try {
    // Process input based on the provided options
    if (argv.url) {
      console.log(chalk.blue(`\nFetching schemas from URL: ${argv.url}`));
      schemas = await getSchemaFromUrl(argv.url);
    } else if (argv.file) {
      console.log(chalk.blue(`\nReading schema from file: ${argv.file}`));
      schemas = await getSchemaFromFile(argv.file);
    } else if (argv.dir) {
      console.log(chalk.blue(`\nScanning directory: ${argv.dir} for ${argv.ext} files`));
      schemas = await getSchemaFromDirectory(argv.dir, argv.ext.split(','));
    } else {
      // Default to current directory
      console.log(chalk.blue(`\nNo source specified, scanning current directory for HTML and JSON files`));
      schemas = await getSchemaFromDirectory('.', ['html', 'json']);
    }
    
    // Filter by schema type if specified
    if (argv.schema && schemas.length > 0) {
      const schemaType = argv.schema;
      schemas = schemas.filter(schema => schema.data['@type'] === schemaType);
      console.log(chalk.blue(`Filtered to ${schemas.length} ${schemaType} schemas`));
    }
    
    if (schemas.length === 0) {
      console.log(chalk.yellow('⚠️ No structured data found. Make sure your JSON-LD is properly formatted.'));
      return;
    }
    
    console.log(chalk.blue(`Found ${schemas.length} structured data items to validate`));
    
    // Validate each schema
    let validCount = 0;
    let invalidCount = 0;
    
    for (const schema of schemas) {
      const { isValid, errors } = validateSchema(schema.data);
      
      if (isValid) {
        validCount++;
        console.log(chalk.green(`✓ Valid schema: ${schema.data['@type']} in ${schema.source}`));
      } else {
        invalidCount++;
        console.log(chalk.red(`✗ Invalid schema: ${schema.data['@type']} in ${schema.source}`));
        displayValidationErrors(schema.data, errors);
        
        if (argv.fix) {
          const fixedSchema = attemptToFixSchema(schema.data, errors);
          if (fixedSchema) {
            console.log(chalk.yellow('Attempted to fix schema. Please review the changes:'));
            console.log(chalk.cyan(JSON.stringify(fixedSchema, null, 2)));
          }
        }
      }
      
      // Test with Google Rich Results Test API if requested
      if (argv.googleTest) {
        await testWithGoogleAPI(schema.data);
      }
    }
    
    // Display summary
    console.log(chalk.blue.bold('\n=== Validation Summary ==='));
    console.log(`Total schemas: ${schemas.length}`);
    console.log(`Valid: ${chalk.green(validCount)}`);
    console.log(`Invalid: ${chalk.red(invalidCount)}`);
    
    // Open Google structured data testing tool if there are errors
    if (invalidCount > 0) {
      console.log(chalk.yellow('\nFor more detailed testing, visit Google's Rich Results Test:'));
      console.log(chalk.cyan('https://search.google.com/test/rich-results'));
    }
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    if (argv.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

/**
 * Get schema from a URL
 */
async function getSchemaFromUrl(url) {
  const spinner = ora(`Fetching URL: ${url}`).start();
  
  try {
    const response = await axios.get(url);
    spinner.succeed(`Fetched URL: ${url}`);
    
    const $ = cheerio.load(response.data);
    const schemas = [];
    
    // Find all script tags with application/ld+json type
    $('script[type="application/ld+json"]').each((index, element) => {
      try {
        const jsonData = JSON.parse($(element).html());
        schemas.push({
          source: url,
          data: jsonData,
        });
      } catch (e) {
        spinner.warn(`Invalid JSON in script tag #${index + 1}`);
      }
    });
    
    return schemas;
  } catch (error) {
    spinner.fail(`Failed to fetch URL: ${url}`);
    throw error;
  }
}

/**
 * Get schema from a file
 */
async function getSchemaFromFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.json') {
      // Parse as JSON file
      const jsonData = JSON.parse(content);
      return [{
        source: filePath,
        data: jsonData,
      }];
    } else if (ext === '.html' || ext === '.htm') {
      // Parse HTML to extract JSON-LD
      const $ = cheerio.load(content);
      const schemas = [];
      
      $('script[type="application/ld+json"]').each((index, element) => {
        try {
          const jsonData = JSON.parse($(element).html());
          schemas.push({
            source: `${filePath} (script #${index + 1})`,
            data: jsonData,
          });
        } catch (e) {
          console.warn(chalk.yellow(`Invalid JSON in script tag #${index + 1} in ${filePath}`));
        }
      });
      
      return schemas;
    } else {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  } catch (error) {
    console.error(chalk.red(`Error reading file: ${filePath}`));
    throw error;
  }
}

/**
 * Get schema from a directory
 */
async function getSchemaFromDirectory(dirPath, extensions) {
  const filePatterns = extensions.map(ext => `${dirPath}/**/*.${ext}`);
  const files = await glob('{' + filePatterns.join(',') + '}');
  
  if (files.length === 0) {
    console.log(chalk.yellow(`No files found in ${dirPath} with extensions: ${extensions.join(', ')}`));
    return [];
  }
  
  const schemas = [];
  
  for (const file of files) {
    try {
      const fileSchemas = await getSchemaFromFile(file);
      schemas.push(...fileSchemas);
    } catch (error) {
      console.warn(chalk.yellow(`Error processing file ${file}: ${error.message}`));
    }
  }
  
  return schemas;
}

/**
 * Validate a schema against Schema.org requirements
 */
function validateSchema(schema) {
  const errors = [];
  let isValid = true;
  
  // Validate basic structure
  if (!schema['@context']) {
    errors.push({ path: '@context', message: 'Missing @context property, should be "https://schema.org"' });
    isValid = false;
  } else if (!schema['@context'].includes('schema.org')) {
    errors.push({ path: '@context', message: `@context should include "schema.org", found "${schema['@context']}"` });
    isValid = false;
  }
  
  if (!schema['@type']) {
    errors.push({ path: '@type', message: 'Missing @type property' });
    isValid = false;
    return { isValid, errors };
  }
  
  // Handle schema arrays (Graph)
  if (Array.isArray(schema['@graph'])) {
    let graphValid = true;
    
    schema['@graph'].forEach((item, index) => {
      const { isValid: itemValid, errors: itemErrors } = validateSchema(item);
      if (!itemValid) {
        graphValid = false;
        errors.push({ 
          path: `@graph[${index}]`, 
          message: `Invalid item in @graph array`, 
          details: itemErrors 
        });
      }
    });
    
    isValid = graphValid;
    return { isValid, errors };
  }
  
  // Validate by schema type
  const schemaType = schema['@type'];
  
  if (schemaSpecs[schemaType]) {
    const spec = schemaSpecs[schemaType];
    
    // Check required properties
    for (const requiredProp of spec.required) {
      if (!schema[requiredProp]) {
        errors.push({ 
          path: requiredProp, 
          message: `Missing required property: ${requiredProp}`,
          severity: 'error'
        });
        isValid = false;
      } else {
        // Validate property type
        if (spec.expectedType && spec.expectedType[requiredProp]) {
          const typeValid = validatePropertyType(schema[requiredProp], spec.expectedType[requiredProp]);
          if (!typeValid) {
            errors.push({ 
              path: requiredProp, 
              message: `Invalid type for ${requiredProp}, expected ${spec.expectedType[requiredProp]}`,
              severity: 'error'
            });
            isValid = false;
          }
        }
      }
    }
    
    // Check recommended properties
    for (const recommendedProp of spec.recommended || []) {
      if (!schema[recommendedProp]) {
        errors.push({ 
          path: recommendedProp, 
          message: `Missing recommended property: ${recommendedProp}`,
          severity: 'warning'
        });
      } else if (spec.expectedType && spec.expectedType[recommendedProp]) {
        // Validate property type
        const typeValid = validatePropertyType(schema[recommendedProp], spec.expectedType[recommendedProp]);
        if (!typeValid) {
          errors.push({ 
            path: recommendedProp, 
            message: `Invalid type for ${recommendedProp}, expected ${spec.expectedType[recommendedProp]}`,
            severity: 'warning'
          });
        }
      }
    }
    
    // Special handling for nested structures
    if (schemaType === 'FAQPage' && schema.mainEntity) {
      validateFAQStructure(schema.mainEntity, errors);
    } else if (schemaType === 'BreadcrumbList' && schema.itemListElement) {
      validateBreadcrumbStructure(schema.itemListElement, errors);
    }
  } else {
    // We don't have specific validation for this schema type
    console.log(chalk.yellow(`No specific validation rules for schema type: ${schemaType}`));
  }
  
  return { isValid, errors };
}

/**
 * Validate property type against expected type
 */
function validatePropertyType(value, expectedType) {
  const types = expectedType.split('|');
  
  for (const type of types) {
    // Check for format specifications like string:date-time
    const [baseType, format] = type.split(':');
    
    if (baseType === 'string' && typeof value === 'string') {
      if (!format) return true;
      
      // Validate formats
      if (format === 'date-time') {
        // Simple ISO date validation
        return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
      }
      return true;
    }
    
    if (baseType === 'number' && typeof value === 'number') return true;
    if (baseType === 'boolean' && typeof value === 'boolean') return true;
    if (baseType === 'object' && typeof value === 'object' && !Array.isArray(value)) return true;
    if (baseType === 'array' && Array.isArray(value)) return true;
  }
  
  return false;
}

/**
 * Validate FAQ page structure
 */
function validateFAQStructure(mainEntity, errors) {
  if (!Array.isArray(mainEntity)) {
    errors.push({ 
      path: 'mainEntity', 
      message: 'mainEntity should be an array of Question items',
      severity: 'error'
    });
    return;
  }
  
  mainEntity.forEach((item, index) => {
    if (!item['@type'] || item['@type'] !== 'Question') {
      errors.push({ 
        path: `mainEntity[${index}].@type`, 
        message: `Expected @type to be "Question", found "${item['@type']}"`,
        severity: 'error'
      });
    }
    
    if (!item.name) {
      errors.push({ 
        path: `mainEntity[${index}].name`, 
        message: 'Missing question text (name property)',
        severity: 'error'
      });
    }
    
    if (!item.acceptedAnswer) {
      errors.push({ 
        path: `mainEntity[${index}].acceptedAnswer`, 
        message: 'Missing acceptedAnswer property',
        severity: 'error'
      });
    } else {
      if (!item.acceptedAnswer['@type'] || item.acceptedAnswer['@type'] !== 'Answer') {
        errors.push({ 
          path: `mainEntity[${index}].acceptedAnswer.@type`, 
          message: `Expected @type to be "Answer", found "${item.acceptedAnswer['@type']}"`,
          severity: 'error'
        });
      }
      
      if (!item.acceptedAnswer.text) {
        errors.push({ 
          path: `mainEntity[${index}].acceptedAnswer.text`, 
          message: 'Missing answer text',
          severity: 'error'
        });
      }
    }
  });
}

/**
 * Validate breadcrumb structure
 */
function validateBreadcrumbStructure(itemListElement, errors) {
  if (!Array.isArray(itemListElement)) {
    errors.push({ 
      path: 'itemListElement', 
      message: 'itemListElement should be an array of ListItem objects',
      severity: 'error'
    });
    return;
  }
  
  itemListElement.forEach((item, index) => {
    if (!item['@type'] || item['@type'] !== 'ListItem') {
      errors.push({ 
        path: `itemListElement[${index}].@type`, 
        message: `Expected @type to be "ListItem", found "${item['@type']}"`,
        severity: 'error'
      });
    }
    
    if (typeof item.position !== 'number') {
      errors.push({ 
        path: `itemListElement[${index}].position`, 
        message: 'position should be a number',
        severity: 'error'
      });
    }
    
    if (!item.name && !item.item) {
      errors.push({ 
        path: `itemListElement[${index}]`, 
        message: 'Either name or item property is required',
        severity: 'error'
      });
    }
    
    if (item.item && typeof item.item === 'object') {
      if (!item.item['@id'] && !item.item.name) {
        errors.push({ 
          path: `itemListElement[${index}].item`, 
          message: 'Item object should have either @id or name property',
          severity: 'error'
        });
      }
    }
  });
}

/**
 * Display validation errors in a user-friendly format
 */
function displayValidationErrors(schema, errors) {
  if (errors.length === 0) return;
  
  console.log(chalk.red('\nValidation Errors:'));
  
  // Group errors by severity
  const errorGroups = {
    error: errors.filter(e => e.severity === 'error' || !e.severity),
    warning: errors.filter(e => e.severity === 'warning')
  };
  
  // Display errors
  if (errorGroups.error.length > 0) {
    console.log(chalk.red('\nErrors (must fix):'));
    errorGroups.error.forEach(error => {
      console.log(chalk.red(`• ${error.path}: ${error.message}`));
      
      if (error.details && argv.verbose) {
        error.details.forEach(detail => {
          console.log(chalk.red(`  - ${detail.path}: ${detail.message}`));
        });
      }
      
      // Suggest fix if possible
      const fix = suggestFix(schema, error);
      if (fix) {
        console.log(chalk.yellow(`  Fix: ${fix}`));
      }
    });
  }
  
  // Display warnings
  if (errorGroups.warning.length > 0) {
    console.log(chalk.yellow('\nWarnings (recommended to fix):'));
    errorGroups.warning.forEach(warning => {
      console.log(chalk.yellow(`• ${warning.path}: ${warning.message}`));
      
      // Suggest fix if possible
      const fix = suggestFix(schema, warning);
      if (fix) {
        console.log(chalk.cyan(`  Fix: ${fix}`));
      }
    });
  }
}

/**
 * Suggest a fix for a validation error
 */
function suggestFix(schema, error) {
  const path = error.path;
  const schemaType = schema['@type'];
  
  // Missing @context
  if (path === '@context') {
    return 'Add "@context": "https://schema.org"';
  }
  
  // Missing required properties
  if (error.message.includes('Missing required property')) {
    if (schemaSpecs[schemaType]?.expectedType?.[path]) {
      const expectedType = schemaSpecs[schemaType].expectedType[path];
      
      if (expectedType === 'string') {
        return `Add "${path}": "value"`;
      } else if (expectedType === 'string:date-time') {
        return `Add "${path}": "YYYY-MM-DDThh:mm:ss+00:00" (ISO format)`;
      } else if (expectedType === 'number') {
        return `Add "${path}": 0`;
      } else if (expectedType === 'object') {
        if (path === 'author') {
          return `Add "${path}": { "@type": "Person", "name": "Author Name" }`;
        } else if (path === 'publisher') {
          return `Add "${path}": { "@type": "Organization", "name": "Publisher Name", "logo": { "@type": "ImageObject", "url": "https://example.com/logo.png" } }`;
        } else if (path === 'location') {
          return `Add "${path}": { "@type": "Place", "name": "Location Name", "address": { "@type": "PostalAddress", "streetAddress": "Street", "addressLocality": "City" } }`;
        }
        return `Add "${path}": { }`;
      } else if (expectedType === 'array') {
        if (path === 'mainEntity') {
          return `Add "${path}": [{ "@type": "Question", "name": "Question text", "acceptedAnswer": { "@type": "Answer", "text": "Answer text" } }]`;
        } else if (path === 'itemListElement') {
          return `Add "${path}": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" }]`;
        }
        return `Add "${path}": []`;
      }
    }
  }
  
  // Invalid types
  if (error.message.includes('Invalid type')) {
    return `Fix type for ${path} to match ${error.message.split('expected ')[1]}`;
  }
  
  return null;
}

/**
 * Attempt to fix common schema issues
 */
function attemptToFixSchema(schema, errors) {
  const fixedSchema = { ...schema };
  let modified = false;
  
  for (const error of errors) {
    // Fix missing @context
    if (error.path === '@context' && !fixedSchema['@context']) {
      fixedSchema['@context'] = 'https://schema.org';
      modified = true;
    }
    
    // Fix missing required properties with placeholder values
    if (error.message.includes('Missing required property')) {
      const path = error.path;
      
      if (!fixedSchema[path]) {
        const schemaType = schema['@type'];
        
        if (schemaSpecs[schemaType]?.expectedType?.[path]) {
          const expectedType = schemaSpecs[schemaType].expectedType[path];
          
          if (expectedType === 'string') {
            fixedSchema[path] = '[PLACEHOLDER] - Replace with real value';
            modified = true;
          } else if (expectedType === 'string:date-time') {
            fixedSchema[path] = new Date().toISOString();
            modified = true;
          } else if (expectedType === 'number') {
            fixedSchema[path] = 0;
            modified = true;
          } else if (expectedType === 'object') {
            if (path === 'author') {
              fixedSchema[path] = { "@type": "Person", "name": "Author Name" };
              modified = true;
            } else if (path === 'publisher') {
              fixedSchema[path] = { 
                "@type": "Organization", 
                "name": "Publisher Name", 
                "logo": { 
                  "@type": "ImageObject", 
                  "url": "https://example.com/logo.png" 
                } 
              };
              modified = true;
            } else if (path === 'location') {
              fixedSchema[path] = { 
                "@type": "Place", 
                "name": "Location Name", 
                "address": { 
                  "@type": "PostalAddress", 
                  "streetAddress": "Street", 
                  "addressLocality": "City" 
                } 
              };
              modified = true;
            } else {
              fixedSchema[path] = {};
              modified = true;
            }
          } else if (expectedType === 'array') {
            if (path === 'mainEntity') {
              fixedSchema[path] = [{ 
                "@type": "Question", 
                "name": "Question text", 
                "acceptedAnswer": { 
                  "@type": "Answer", 
                  "text": "Answer text" 
                } 
              }];
              modified = true;
            } else if (path === 'itemListElement') {
              fixedSchema[path] = [{ 
                "@type": "ListItem", 
                "position": 1, 
                "name": "Home", 
                "item": "https://example.com" 
              }];
              modified = true;
            } else {
              fixedSchema[path] = [];
              modified = true;
            }
          }
        }
      }
    }
  }
  
  return modified ? fixedSchema : null;
}

/**
 * Test a schema with Google's Rich Results Test API
 */
async function testWithGoogleAPI(schema) {
  const spinner = ora('Testing with Google Rich Results Test API...').start();
  
  try {
    // For the real API, we'd need API keys, but as those aren't readily available,
    // we'll just open the test website with the schema as escaped JSON
    const jsonString = JSON.stringify(schema);
    const encodedJson = encodeURIComponent(jsonString);
    const testUrl = `https://search.google.com/test/rich-results?url=&user_agent=2&html=${encodedJson}`;
    
    spinner.succeed('Opening Google Rich Results Test page...');
    await open(testUrl);
    
    return true;
  } catch (error) {
    spinner.fail(`Failed to test with Google Rich Results Test: ${error.message}`);
    return false;
  }
}

// Check if we have the required dependencies
function checkDependencies() {
  const dependencies = ['axios', 'cheerio', 'chalk', 'ajv', 'ajv-formats', 'glob', 'ora', 'yargs'];
  const missing = [];
  
  for (const dep of dependencies) {
    try {
      require.resolve(dep);
    } catch (e) {
      missing.push(dep);
    }
  }
  
  if (missing.length > 0) {
    console.error(chalk.red(`Missing dependencies: ${missing.join(', ')}`));
    console.log(chalk.yellow(`Please install them by running: npm install ${missing.join(' ')} --save-dev`));
    
    // Ask if we should install them automatically
    console.log(chalk.yellow('Would you like to install them now? (y/n)'));
    
    // This is a synchronous method, but it's simple for a script
    const readline = require('readline-sync');
    const answer = readline.question('> ');
    
    if (answer.toLowerCase() === 'y') {
      console.log(chalk.blue('Installing dependencies...'));
      try {
        execSync(`npm install ${missing.join(' ')} --save-dev`, { stdio: 'inherit' });
        console.log(chalk.green('Dependencies installed successfully.'));
      } catch (error) {
        console.error(chalk.red('Failed to install dependencies.'));
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

// Main function
async function run() {
  try {
    checkDependencies();
    await main();
  } catch (error) {
    console.error(chalk.red(`\nError: ${error.message}`));
    if (argv.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

run(); 