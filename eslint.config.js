// @ts-check
import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/.astro',
      '**/.github',
      '**/.changeset',
      '**/draco',
    ],
  },

  // JavaScript
  eslint.configs.recommended,
  // TypeScript
  ...tseslint.configs.recommended,

  // Allow triple-slash references in `*.d.ts` files.
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Astro
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      'astro/no-set-html-directive': 'error',
    },
  },
);
