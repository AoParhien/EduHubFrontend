import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_']);
  const envDefinitions = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
  );

  return {
    plugins: [
      react({
        include: /\.(js|jsx|ts|tsx)$/,
      }),
    ],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    define: {
      ...envDefinitions,
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('@chakra-ui')) {
              return 'chakra-vendor';
            }

            if (id.includes('@emotion') || id.includes('framer-motion')) {
              return 'chakra-vendor';
            }

            if (
              id.includes('@react-google-maps') ||
              id.includes('mapbox-gl') ||
              id.includes('react-map-gl') ||
              id.includes('leaflet') ||
              id.includes('react-leaflet') ||
              id.includes('here-maps-react')
            ) {
              return 'maps-vendor';
            }

            return undefined;
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
    },
  };
});
