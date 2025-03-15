#!/usr/bin/env node

/**
 * Simple Structured Data Validator Script
 * 
 * This script validates JSON-LD structured data against Schema.org requirements.
 * It's a simplified version that doesn't rely on external dependencies.
 * 
 * Usage:
 * node scripts/validate-schema-simple.js ./public/example-schemas/article.json
 * node scripts/validate-schema-simple.js ./public/example-schemas/invalid-article.json
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const filePath = process.argv[2];

console.log('Starting validation script...');
console.log('Arguments:', process.argv);

if (!filePath) {
  console.error('Error: Please provide a file path to validate');
  console.log('Usage: node scripts/validate-schema-simple.js ./path/to/schema.json');
  process.exit(1);
}

// Schema.org context URL
const SCHEMA_CONTEXT = 'https://schema.org';

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
  console.log('🔍 Simple Structured Data Validator');
  console.log('Validating JSON-LD schema against Schema.org requirements');
  
  try {
    console.log(`\nReading schema from file: ${filePath}`);
    const content = await fs.promises.readFile(filePath, 'utf8');
    console.log('File content:', content.substring(0, 100) + '...');
    
    const schema = JSON.parse(content);
    console.log('Parsed schema:', schema);
    
    console.log(`Schema type: ${schema['@type'] || 'Unknown'}`);
    
    const { isValid, errors } = validateSchema(schema);
    console.log('Validation result:', { isValid, errorCount: errors.length });
    
    if (isValid) {
      console.log(`✓ Valid schema: ${schema['@type']} in ${filePath}`);
    } else {
      console.log(`✗ Invalid schema: ${schema['@type']} in ${filePath}`);
      displayValidationErrors(schema, errors);
      
      const fixedSchema = attemptToFixSchema(schema, errors);
      if (fixedSchema) {
        console.log('\nAttempted to fix schema. Please review the changes:');
        console.log(JSON.stringify(fixedSchema, null, 2));
      }
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
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
    console.log(`No specific validation rules for schema type: ${schemaType}`);
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
  
  console.log('\nValidation Errors:');
  
  // Group errors by severity
  const errorGroups = {
    error: errors.filter(e => e.severity === 'error' || !e.severity),
    warning: errors.filter(e => e.severity === 'warning')
  };
  
  // Display errors
  if (errorGroups.error.length > 0) {
    console.log('\nErrors (must fix):');
    errorGroups.error.forEach(error => {
      console.log(`• ${error.path}: ${error.message}`);
      
      // Suggest fix if possible
      const fix = suggestFix(schema, error);
      if (fix) {
        console.log(`  Fix: ${fix}`);
      }
    });
  }
  
  // Display warnings
  if (errorGroups.warning.length > 0) {
    console.log('\nWarnings (recommended to fix):');
    errorGroups.warning.forEach(warning => {
      console.log(`• ${warning.path}: ${warning.message}`);
      
      // Suggest fix if possible
      const fix = suggestFix(schema, warning);
      if (fix) {
        console.log(`  Fix: ${fix}`);
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
    
    // Fix invalid date format
    if (error.message.includes('Invalid type') && error.message.includes('string:date-time')) {
      const path = error.path;
      if (typeof fixedSchema[path] === 'string') {
        // Try to convert to ISO format
        try {
          const date = new Date(fixedSchema[path]);
          if (!isNaN(date.getTime())) {
            fixedSchema[path] = date.toISOString();
            modified = true;
          }
        } catch (e) {
          // Ignore conversion errors
        }
      }
    }
    
    // Fix invalid image type
    if (error.path === 'image' && error.message.includes('Invalid type')) {
      if (typeof fixedSchema.image === 'boolean') {
        fixedSchema.image = 'https://example.com/placeholder-image.jpg';
        modified = true;
      }
    }
  }
  
  return modified ? fixedSchema : null;
}

// Run the main function
main().catch(error => {
  console.error(`\nError: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}); 