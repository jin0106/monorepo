/**
 * restApi swagger 문서 기반 type, react-query fetching 훅 제너레이터
 * @link https://orval.dev/guides/react-query
 */

module.exports = {
  neubilityAdmin: {
    input: {
      target: 'https://dev-order-api.neubie.co.kr/docs/schema/admin/'
    },
    output: {
      mode: 'split',
      target: './src/api/generated/hooks.ts',
      schemas: './src/api/generated/types',
      client: 'react-query',
      override: {
        formUrlEncoded: false,
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance'
        },
        formData: {
          path: './src/api/mutator/custom-form-data.ts',
          name: 'customFormData'
        },
        useDates: false,
        query: {
          useQuery: true,
          useInfinite: true
        }
      }
    },
    hooks: {
      afterAllFilesWrite: ['eslint --fix', 'prettier --write']
    }
  },
  neubility: {
    input: {
      target: 'https://dev-order-api.neubie.co.kr/docs/schema/',
      override: {
        transformer: './src/api/transformer/filter-id.js'
      }
    },
    output: {
      mode: 'split',
      target: './src/api/generated/hooks-extension.ts',
      schemas: './src/api/generated/types',
      client: 'react-query',
      override: {
        formUrlEncoded: false,
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance'
        },
        formData: {
          path: './src/api/mutator/custom-form-data.ts',
          name: 'customFormData'
        },
        useDates: false,
        query: {
          useQuery: true,
          useInfinite: true
        }
      }
    },
    hooks: {
      afterAllFilesWrite: ['eslint --fix', 'prettier --write']
    }
  }
}
