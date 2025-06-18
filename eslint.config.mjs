import typescriptEslint from '@typescript-eslint/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import playwright from 'eslint-plugin-playwright';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'node_modules/*',
      '.*/*',
      'dist/*',
      'playwright-report/*',
      'test-results/*',
      '**/*.md',
    ],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      playwright,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['playwright/**/*'],

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/valid-describe-callback': 'error',
      'playwright/valid-expect': 'error',
      'playwright/missing-playwright-await': 'error',
    },
  },
  {
    files: ['**/*.ts'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    rules: {
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': ['error'],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': ['error'],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': ['error'],
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': ['error'],
    },
  },
  {
    files: ['**/*.ts'],

    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic/ts': stylisticTs,
    },

    rules: {
      '@stylistic/ts/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },

          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],

      '@stylistic/ts/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/type-annotation-spacing': 'error',
    },
  },
  {
    files: ['**/*.ts'],

    plugins: {
      import: fixupPluginRules(_import),
      '@typescript-eslint': typescriptEslint,
    },

    rules: {
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
        },
      ],

      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/dot-notation': 'off',

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',

          overrides: {
            accessors: 'explicit',
            constructors: 'explicit',
          },
        },
      ],

      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: ['static-field', 'instance-field', 'constructor', 'instance-method'],
        },
      ],

      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',

      '@typescript-eslint/no-shadow': [
        'error',
        {
          hoist: 'all',
        },
      ],

      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],

      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/ban-types': 'off',

      '@typescript-eslint/typedef': [
        'error',
        {
          arrowParameter: true,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: true,
          memberVariableDeclaration: true,
          propertyDeclaration: true,
          parameter: true,
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'arrow-body-style': 'off',
      'arrow-parens': ['off', 'always'],
      'brace-style': ['off', '1tbs'],
      'comma-dangle': 'off',

      complexity: [
        'error',
        {
          max: 35,
        },
      ],

      'constructor-super': 'error',
      curly: 'error',
      'dot-notation': 'off',
      'eol-last': 'off',
      eqeqeq: ['error', 'always'],
      'guard-for-in': 'error',
      'id-match': 'error',
      'import/no-default-export': 'error',
      'import/no-deprecated': 'warn',

      'import/newline-after-import': [
        'warn',
        {
          count: 1,
        },
      ],

      indent: 'off',
      'linebreak-style': 'off',
      'max-classes-per-file': 'off',

      'max-len': [
        'error',
        {
          ignorePattern: '^import |^export | implements |^ +(private|public|protected|const|let|.+ =) ',
          code: 200,
        },
      ],

      'max-lines': ['error', 550],
      'new-parens': 'off',
      'newline-per-chained-call': 'off',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',

      'no-console': [
        'error',
        {
          allow: [
            'info',
            'warn',
            'dir',
            'timeLog',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupEnd',
            'table',
            'dirxml',
            'error',
            'groupCollapsed',
            'Console',
            'profile',
            'profileEnd',
            'timeStamp',
            'context',
          ],
        },
      ],

      'no-debugger': 'error',
      'no-empty': 'off',
      'no-empty-function': 'off',
      'no-eval': 'error',
      'no-extra-semi': 'off',
      'no-fallthrough': 'error',
      'no-invalid-this': 'off',
      'no-irregular-whitespace': 'off',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
        },
      ],

      'no-new-wrappers': 'error',
      'no-restricted-imports': ['error', 'rxjs/Rx'],
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': ['off'],
      'no-unsafe-finally': 'error',
      'no-unused-expressions': 'off',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',

      'padded-blocks': [
        'off',
        {
          blocks: 'never',
        },
        {
          allowSingleLineBlocks: true,
        },
      ],

      'prefer-const': 'error',
      radix: 'error',
      semi: 'error',
      'space-before-function-paren': 'off',
      'space-in-parens': ['off', 'never'],

      'spaced-comment': [
        'error',
        'always',
        {
          markers: ['/'],
        },
      ],

      'use-isnan': 'error',
      'no-unused-vars': 'off',
      'no-prototype-builtins': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],

    rules: {
      'max-classes-per-file': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/typedef': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'max-lines': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],

    rules: {
      'import/no-default-export': 'off',
    },
  },
];
