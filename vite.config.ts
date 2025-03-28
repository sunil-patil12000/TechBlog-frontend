import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
// @ts-ignore - rollup-plugin-visualizer might not have type declarations
import { visualizer } from 'rollup-plugin-visualizer';
import sitemap from 'vite-plugin-sitemap';
import { imagetools } from 'vite-imagetools';
import * as path from 'path';
import { splitVendorChunkPlugin } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// TypeScript interface for asset info
interface AssetInfo {
  name: string;
  source: Buffer | string;
  type: string;
  [key: string]: any;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Site URL for sitemap
  const siteUrl = env.VITE_APP_URL || 'https://yourdomain.com';

  // Determine if current build is SSG
  const isSSG = process.env.SSG === 'true';

  return {
    plugins: [
      react({
        // Add babel plugins or preset options for React
        babel: {
          plugins: [
            // Enable additional babel plugins if needed
            // e.g., ['@babel/plugin-proposal-decorators', { legacy: true }]
          ],
        },
        // @ts-ignore - fastRefresh exists but might not be in the types
        fastRefresh: true,
      }),
      // Image optimization
      imagetools({
        include: ['**/*.{jpg,jpeg,png,webp}'],
        defaultDirectives: new URLSearchParams([
          ['format', 'webp;avif'], // Output webp and avif formats
          ['quality', '80'],       // Good balance of quality/size
          ['as', 'picture'],       // Use <picture> elements
        ]),
      }),
      // More advanced image optimization
      ViteImageOptimizer({
        png: {
          quality: 80,
          compressionLevel: 9,
        },
        jpeg: {
          quality: 80,
          progressive: true,
        },
        jpg: {
          quality: 80,
          progressive: true,
        },
        webp: {
          lossless: false,
          quality: 80,
          alphaQuality: 90,
        },
        avif: {
          lossless: false,
          quality: 75,
        },
        // SVG optimization
        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  cleanupNumericValues: {
                    floatPrecision: 2,
                  },
                },
              },
            },
            'removeDimensions',
          ],
        },
      }),
      // Split vendor chunks for better caching
      splitVendorChunkPlugin(),
      // Progressive Web App support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml', 'apple-touch-icon.png'],
        manifest: {
          name: 'Tech Blog',
          short_name: 'TechBlog',
          description: 'A modern tech blog featuring articles on web development and technology',
          theme_color: '#4f46e5', // indigo-600
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          // Enable PWA in development for testing
          enabled: process.env.SW_DEV === 'true',
          /* other PWA dev options */
        },
        workbox: {
          // Workbox options
          globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
          runtimeCaching: [
            {
              // @ts-ignore - urlPattern function is valid but TypeScript might not recognize it
              urlPattern: ({ url }: { url: URL }) => {
                return url.origin === 'https://fonts.googleapis.com' || 
                       url.origin === 'https://fonts.gstatic.com';
              },
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\.domain\.com\/api/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60, // 1 hour
                },
                networkTimeoutSeconds: 10,
              },
            },
            // Cache images with a Cache First strategy
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // Cache CSS and JavaScript files with a Stale While Revalidate strategy
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
          ],
          // Don't precache sourcemaps or large chunks
          ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
          skipWaiting: true,
          clientsClaim: true,
        },
      }),
      // Use a simpler configuration for the sitemap plugin
      // @ts-ignore - Adding a direct comment to suppress type errors
      sitemap({
        hostname: siteUrl,
        // We're using our custom script for a complete sitemap
        outDir: './dist',
        // Note: For a complete sitemap with dynamic routes, 
        // we use the scripts/generate-sitemap-advanced.ts script
      }),
      // Compression Plugin - Gzip
      viteCompression({
        algorithm: 'gzip',
        threshold: 10240, // Only compress files > 10kb
      }),
      // Compression Plugin - Brotli
      viteCompression({
        algorithm: 'brotliCompress',
        threshold: 10240,
      }),
      // Bundle size analyzer (only in build mode)
      mode === 'analyze' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': '/src',
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@lib': path.resolve(__dirname, './src/lib'),
      },
    },
    css: {
      preprocessorOptions: {
        // If using SCSS or other preprocessors
      },
      // Inline CSS for components smaller than this threshold to reduce HTTP requests
      inlineThreshold: 4096, // 4kb
    },
    server: {
      port: 3000,
      host: true, // Listen on all addresses
      // Configure proxy for backend API
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/uploads': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      // SSG requires a compatible output target
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      // Minify options
      minify: 'terser',
      terserOptions: {
        // Terser options
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        },
        format: {
          comments: false,
        },
      },
      // Code splitting strategy
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Group React-related packages
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('node_modules/scheduler')) {
              return 'vendor-react';
            }
            
            // Group routing-related packages
            if (id.includes('node_modules/react-router') || 
                id.includes('node_modules/@remix-run/router') || 
                id.includes('node_modules/history')) {
              return 'vendor-router';
            }
            
            // Group UI-related packages
            if (id.includes('node_modules/@mui') || 
                id.includes('node_modules/@emotion') || 
                id.includes('node_modules/framer-motion') ||
                id.includes('node_modules/lucide-react')) {
              return 'vendor-ui';
            }
            
            // Group utility libraries
            if (id.includes('node_modules/axios') || 
                id.includes('node_modules/lodash') || 
                id.includes('node_modules/date-fns')) {
              return 'vendor-utils';
            }
            
            // Other node_modules stay in vendor
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
      // Chunk size warning
      chunkSizeWarningLimit: 1000, // 1MB
      // Asset file naming
      assetFileNames: (assetInfo: AssetInfo) => {
        const info = assetInfo.name.split('.');
        const extType = info[info.length - 1];
        if (/\.(png|jpe?g|gif|svg|webp|ico|avif)$/i.test(assetInfo.name)) {
          return `assets/images/[name]-[hash][extname]`;
        }
        if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
          return `assets/fonts/[name]-[hash][extname]`;
        }
        return `assets/[name]-[hash][extname]`;
      },
      // Output file naming
      chunkFileNames: 'assets/js/[name]-[hash].js',
      entryFileNames: 'assets/js/[name]-[hash].js',
      // SSG options
      ssrManifest: true,
      // Generate sourcemaps only in development
      sourcemap: mode !== 'production',
      // Configure modulePreload (improves performance)
      modulePreload: {
        polyfill: true,
      },
    },
    optimizeDeps: {
      // Force inclusions for optimization
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'axios',
        'react-helmet-async',
        'date-fns',
      ],
      // Force exclusions from optimization
      exclude: [],
      // Force ESM dependencies to be bundled
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
    // SSG specific configuration
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: {
        // Inline critical CSS
        preload: 'swap',
        // Don't inline preloaded resources
        preloadFonts: false,
        // Additional options for critters
        pruneSource: true,
        reduceInlineStyles: true,
        mergeStylesheets: true,
        additionalStylesheets: [],
        // Handle keyframe animations
        keyframes: true,
        // Include shadow DOM content
        shadowDOM: true,
      },
    },
  };
});
