import { describe, expect, test } from '@jest/globals'
import formatter from '../index.js'

describe('formatter', () => {
  test('return nothing with empty input', () => {
    const input = null
    const output = formatter(input)
    const expected = undefined

    expect(output).toBe(expected)
  })
  test('return error object with valid input', () => {
    const input = ' /foo.js:12:34: Some error message. (rule)'
    const output = formatter(input)
    const expected = {
      check_name: 'rule',
      description: 'Some error message. (rule)',
      location: {
        path: '/foo.js',
        positions: {
          begin: {
            column: 34,
            line: 12
          }
        }
      },
      severity: 'major'
    }

    expect(output).toStrictEqual(expected)
  })
})
