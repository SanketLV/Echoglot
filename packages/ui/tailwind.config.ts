import baseConfig from '@echoglot/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
