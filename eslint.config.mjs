import { FlatCompat } from '@eslint/eslintrc'
import unusedImports from 'eslint-plugin-unused-imports'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // 사용하지 않는 import 자동 제거
      'unused-imports/no-unused-imports': 'error',
      // 사용하지 않는 변수 경고
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // 세미콜론 관련 규칙
      semi: ['error', 'never'],
      'no-extra-semi': 'error',
      // 따옴표 관련 규칙 (백틱 허용)
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      // 쉼표 관련 규칙
      'comma-dangle': ['error', 'always-multiline'],
      // 공백 관련 규칙
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      // 자동 수정 가능한 규칙들
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
  },
]

export default eslintConfig
