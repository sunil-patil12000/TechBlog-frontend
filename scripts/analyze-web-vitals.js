#!/usr/bin/env node

/**
 * Core Web Vitals Analysis Script
 * 
 * This script helps identify and fix Core Web Vitals issues in your React app.
 * It uses Lighthouse to measure key metrics and provides optimization recommendations.
 * 
 * The following metrics are analyzed:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay) / TBT (Total Blocking Time)
 * - CLS (Cumulative Layout Shift)
 * - TTFB (Time to First Byte)
 * - FCP (First Contentful Paint)
 * 
 * Usage:
 * - npm run analyze:vitals -- --url=https://yourdomain.com
 * - npm run analyze:vitals -- --url=https://yourdomain.com --mobile
 * - npm run analyze:vitals -- --url=https://yourdomain.com --desktop
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const chalk = require('chalk');
const ora = require('ora');
const open = require('open');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    description: 'The URL to analyze',
    type: 'string',
    default: 'http://localhost:3000',
  })
  .option('mobile', {
    description: 'Run mobile analysis',
    type: 'boolean',
    default: false,
  })
  .option('desktop', {
    description: 'Run desktop analysis',
    type: 'boolean',
    default: false,
  })
  .option('output', {
    alias: 'o',
    description: 'Output file path for HTML report',
    type: 'string',
    default: path.join(process.cwd(), 'lighthouse-report.html'),
  })
  .option('json', {
    description: 'Output JSON report',
    type: 'boolean',
    default: true,
  })
  .option('jsonPath', {
    description: 'Path for JSON report',
    type: 'string',
    default: path.join(process.cwd(), 'lighthouse-report.json'),
  })
  .help()
  .argv;

// Determine device type
const isMobile = argv.mobile || (!argv.desktop && true); // Default to mobile
const isDesktop = argv.desktop;

/**
 * Run Lighthouse analysis
 */
async function runLighthouseAnalysis() {
  const url = argv.url;
  const spinner = ora(`Analyzing Core Web Vitals for ${url} (${isMobile ? 'Mobile' : 'Desktop'})`).start();

  try {
    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    });

    // Run Lighthouse analysis
    const options = {
      logLevel: 'error',
      output: ['html', 'json'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      formFactor: isMobile ? 'mobile' : 'desktop',
      screenEmulation: isMobile ? { mobile: true } : { mobile: false },
      emulatedUserAgent: isMobile
        ? 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    };

    const runnerResult = await lighthouse(url, options);

    // Kill Chrome
    await chrome.kill();

    // Write HTML report
    fs.writeFileSync(argv.output, runnerResult.report[0]);

    // Write JSON report if requested
    if (argv.json) {
      fs.writeFileSync(argv.jsonPath, runnerResult.report[1]);
    }

    spinner.succeed(`Analysis complete. Report saved to ${argv.output}`);

    // Parse and display results
    const results = JSON.parse(runnerResult.report[1]);
    displayResults(results);

    // Provide recommendations
    provideRecommendations(results);

    // Open the HTML report
    console.log(chalk.cyan('\nOpening HTML report...'));
    await open(argv.output);

    return results;
  } catch (error) {
    spinner.fail(`Analysis failed: ${error.message}`);
    console.error(chalk.red(error));
    process.exit(1);
  }
}

/**
 * Display the analysis results
 */
function displayResults(results) {
  console.log('\n');
  console.log(chalk.bold.blue('=== Core Web Vitals Analysis Results ==='));
  console.log('\n');

  // Performance score
  const performanceScore = results.categories.performance.score * 100;
  const performanceColor = getScoreColor(performanceScore);
  console.log(`${chalk.bold('Performance Score:')} ${chalk[performanceColor](performanceScore.toFixed(0) + '/100')}`);

  // Core Web Vitals metrics
  const metrics = results.audits;

  // LCP
  const lcp = metrics['largest-contentful-paint'].numericValue / 1000;
  const lcpScore = metrics['largest-contentful-paint'].score * 100;
  const lcpColor = getLcpColor(lcp);
  console.log(`${chalk.bold('LCP (Largest Contentful Paint):')} ${chalk[lcpColor](lcp.toFixed(2) + 's')} - ${getMetricDescription(lcpScore)}`);

  // FID/TBT
  const tbt = metrics['total-blocking-time'].numericValue;
  const tbtScore = metrics['total-blocking-time'].score * 100;
  const tbtColor = getTbtColor(tbt);
  console.log(`${chalk.bold('TBT (Total Blocking Time):')} ${chalk[tbtColor](tbt.toFixed(0) + 'ms')} - ${getMetricDescription(tbtScore)}`);
  console.log(`${chalk.dim('Note: TBT is a proxy for FID (First Input Delay) in lab testing')}`);

  // CLS
  const cls = metrics['cumulative-layout-shift'].numericValue;
  const clsScore = metrics['cumulative-layout-shift'].score * 100;
  const clsColor = getClsColor(cls);
  console.log(`${chalk.bold('CLS (Cumulative Layout Shift):')} ${chalk[clsColor](cls.toFixed(3))} - ${getMetricDescription(clsScore)}`);

  // TTFB
  const ttfb = metrics['server-response-time'].numericValue / 1000;
  const ttfbScore = metrics['server-response-time'].score * 100;
  const ttfbColor = getTtfbColor(ttfb);
  console.log(`${chalk.bold('TTFB (Time to First Byte):')} ${chalk[ttfbColor](ttfb.toFixed(2) + 's')} - ${getMetricDescription(ttfbScore)}`);

  // FCP
  const fcp = metrics['first-contentful-paint'].numericValue / 1000;
  const fcpScore = metrics['first-contentful-paint'].score * 100;
  const fcpColor = getFcpColor(fcp);
  console.log(`${chalk.bold('FCP (First Contentful Paint):')} ${chalk[fcpColor](fcp.toFixed(2) + 's')} - ${getMetricDescription(fcpScore)}`);

  console.log('\n');
  console.log(chalk.bold.blue('=== Other Key Metrics ==='));
  console.log('\n');

  // Accessibility Score
  const accessibilityScore = results.categories.accessibility.score * 100;
  const accessibilityColor = getScoreColor(accessibilityScore);
  console.log(`${chalk.bold('Accessibility Score:')} ${chalk[accessibilityColor](accessibilityScore.toFixed(0) + '/100')}`);

  // SEO Score
  const seoScore = results.categories.seo.score * 100;
  const seoColor = getScoreColor(seoScore);
  console.log(`${chalk.bold('SEO Score:')} ${chalk[seoColor](seoScore.toFixed(0) + '/100')}`);

  // Best Practices Score
  const bestPracticesScore = results.categories['best-practices'].score * 100;
  const bestPracticesColor = getScoreColor(bestPracticesScore);
  console.log(`${chalk.bold('Best Practices Score:')} ${chalk[bestPracticesColor](bestPracticesScore.toFixed(0) + '/100')}`);
}

/**
 * Provide recommendations based on the analysis
 */
function provideRecommendations(results) {
  console.log('\n');
  console.log(chalk.bold.blue('=== Recommendations ==='));
  console.log('\n');

  const audits = results.audits;
  const metrics = {
    lcp: audits['largest-contentful-paint'].score,
    tbt: audits['total-blocking-time'].score,
    cls: audits['cumulative-layout-shift'].score,
    ttfb: audits['server-response-time'].score,
    fcp: audits['first-contentful-paint'].score,
  };

  // LCP recommendations
  if (metrics.lcp < 0.9) {
    console.log(chalk.bold('LCP Recommendations:'));
    
    // Check for image optimization issues
    if (audits['uses-optimized-images'].score < 1) {
      console.log(chalk.yellow('• Optimize images: Use WebP/AVIF formats and proper image compression'));
      console.log(chalk.dim('  - Implement the ResponsiveImage component for all images'));
      console.log(chalk.dim('  - Use vite-plugin-image-optimizer for build-time optimization'));
    }

    // Check for render-blocking resources
    if (audits['render-blocking-resources'].score < 1) {
      console.log(chalk.yellow('• Reduce render-blocking resources:'));
      console.log(chalk.dim('  - Add preload hints for critical CSS/fonts'));
      console.log(chalk.dim('  - Use dynamic imports for non-critical JavaScript'));
      console.log(chalk.dim('  - Load third-party scripts asynchronously or defer them'));
    }

    // Check for critical request chains
    if (audits['critical-request-chains'].score < 1) {
      console.log(chalk.yellow('• Optimize critical request chains:'));
      console.log(chalk.dim('  - Inline critical CSS'));
      console.log(chalk.dim('  - Preconnect to required origins'));
      console.log(chalk.dim('  - Use HTTP/2 for multiplexing requests'));
    }

    console.log('');
  }

  // TBT/FID recommendations
  if (metrics.tbt < 0.9) {
    console.log(chalk.bold('TBT/FID Recommendations:'));
    
    // Check for long main thread tasks
    if (audits['long-tasks'].score < 1) {
      console.log(chalk.yellow('• Reduce JavaScript execution time:'));
      console.log(chalk.dim('  - Break up long tasks using Web Workers or requestIdleCallback'));
      console.log(chalk.dim('  - Lazy load non-critical components'));
      console.log(chalk.dim('  - Use code splitting to reduce initial bundle size'));
    }

    // Check for unused JavaScript
    if (audits['unused-javascript'].score < 1) {
      console.log(chalk.yellow('• Remove unused JavaScript:'));
      console.log(chalk.dim('  - Review dependencies and remove unnecessary ones'));
      console.log(chalk.dim('  - Use tree shaking to eliminate dead code'));
      console.log(chalk.dim('  - Consider using bundle analyzer to identify bloat'));
    }

    console.log('');
  }

  // CLS recommendations
  if (metrics.cls < 0.9) {
    console.log(chalk.bold('CLS Recommendations:'));
    
    // Check for layout shift issues
    if (audits['layout-shift-elements']) {
      console.log(chalk.yellow('• Prevent layout shifts:'));
      console.log(chalk.dim('  - Always specify width and height for images'));
      console.log(chalk.dim('  - Use CSS aspect-ratio or computed padding-top technique'));
      console.log(chalk.dim('  - Reserve space for dynamic content (ads, embeds)'));
      console.log(chalk.dim('  - Move font loads to the document head with preload'));
    }

    // Check for non-composited animations
    if (audits['non-composited-animations']) {
      console.log(chalk.yellow('• Optimize animations:'));
      console.log(chalk.dim('  - Use transform/opacity for animations instead of properties that trigger layout'));
      console.log(chalk.dim('  - Add will-change or transform: translateZ(0) for better compositing'));
    }

    console.log('');
  }

  // TTFB recommendations
  if (metrics.ttfb < 0.9) {
    console.log(chalk.bold('TTFB Recommendations:'));
    console.log(chalk.yellow('• Improve server response time:'));
    console.log(chalk.dim('  - Use a CDN for edge caching'));
    console.log(chalk.dim('  - Implement proper caching headers'));
    console.log(chalk.dim('  - Consider using Static Site Generation (SSG)'));
    console.log(chalk.dim('  - Optimize backend API response times'));
    console.log('');
  }

  // Resource hints
  console.log(chalk.bold('Additional Optimizations:'));
  console.log(chalk.yellow('• Add resource hints:'));
  console.log(chalk.dim('  - Use <link rel="preconnect"> for important third-party domains'));
  console.log(chalk.dim('  - Use <link rel="preload"> for critical fonts and CSS'));
  console.log(chalk.dim('  - Use <link rel="prefetch"> for resources needed for next navigation'));

  console.log('\n');
  console.log(chalk.bold.green('==== Next Steps ===='));
  console.log(chalk.green('1. Fix the issues with the highest impact first (look for "Opportunities" in the HTML report)'));
  console.log(chalk.green('2. Rerun this analysis after making changes to measure improvement'));
  console.log(chalk.green('3. Test on real devices with tools like WebPageTest or Chrome UX Report'));
  console.log(chalk.green('4. Set up monitoring for field data using the Web Vitals JavaScript library'));
  console.log('\n');
}

// Utility functions for color coding scores
function getScoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

function getLcpColor(seconds) {
  if (seconds <= 2.5) return 'green';
  if (seconds <= 4.0) return 'yellow';
  return 'red';
}

function getTbtColor(milliseconds) {
  if (milliseconds <= 200) return 'green';
  if (milliseconds <= 600) return 'yellow';
  return 'red';
}

function getClsColor(value) {
  if (value <= 0.1) return 'green';
  if (value <= 0.25) return 'yellow';
  return 'red';
}

function getTtfbColor(seconds) {
  if (seconds <= 0.8) return 'green';
  if (seconds <= 1.8) return 'yellow';
  return 'red';
}

function getFcpColor(seconds) {
  if (seconds <= 1.8) return 'green';
  if (seconds <= 3.0) return 'yellow';
  return 'red';
}

function getMetricDescription(score) {
  if (score >= 90) return chalk.green('Good');
  if (score >= 50) return chalk.yellow('Needs Improvement');
  return chalk.red('Poor');
}

// Check if we have the required dependencies
function checkDependencies() {
  const dependencies = ['lighthouse', 'chrome-launcher', 'ora', 'chalk', 'open', 'yargs'];
  
  for (const dep of dependencies) {
    try {
      require.resolve(dep);
    } catch (e) {
      console.error(chalk.red(`Missing dependency: ${dep}`));
      console.log(chalk.yellow(`Please install it by running: npm install ${dep} --save-dev`));
      process.exit(1);
    }
  }
}

// Main function
async function main() {
  try {
    checkDependencies();
    await runLighthouseAnalysis();
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

main(); 