import crypto from 'crypto'

function createFingerprint (source, line, column, rule) {
  return crypto.createHash('sha256').update(
    `${source}:${line}:${column}:${rule}`
  ).digest('hex')
}

export default function formatter (input) {
  // ignore lines that don't match the expected format
  if (!input || !input.match(/: /)) return

  let [path, line, column, message] = input.split(':')

  // cleanup
  path = path.trim()
  message = message.trim()
  line = parseInt(line)
  column = parseInt(column)

  let rule = 'unknown-rule'

  if (message.lastIndexOf('(') !== -1) {
    const positionOfLastOpeningBrace = message.lastIndexOf('(')
    rule = message.substring(positionOfLastOpeningBrace + 1, message.length - 1)
    message = message.substring(0, positionOfLastOpeningBrace).trim()
  }

  return {
    description: `${message} (${rule})`,
    check_name: rule,
    fingerprint: createFingerprint(path, line, column, rule),
    severity: 'major',
    location: {
      path,
      positions: {
        begin: {
          line,
          column
        }
      }
    }
  }
}
