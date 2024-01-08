#!/usr/bin/env node
import fs from 'fs'
import concat from 'concat-stream'
import formatter from './index.js'

// if run in a terminal explain how to use it
if (process.stdin.isTTY) {
  console.error('This module is meant to be used as a formatter for `standard`')
  console.error()
  console.error('  Usage: standard | standard-gitlab -o output.json')
  console.error()

  process.exit(1)
}

process.stdin.pipe(concat(function (buffer) {
  const errors = []
  buffer
    .toString()
    .split('\n')
    .forEach(line => {
      const error = formatter(line)
      if (error) {
        errors.push(error)
      }
    })

  // if there are no errors, exit with 0
  if (errors.length === 0) {
    process.exit(0)
  }

  // checks for -o / --output-file to output to a given file
  let outputPathIndex = process.argv.indexOf('--output-file')
  if (outputPathIndex === -1) {
    outputPathIndex = process.argv.indexOf('-o')
  }
  if (outputPathIndex > -1) {
    let outputPath = process.argv[outputPathIndex + 1]
    if (outputPath) {
      outputPath = `${process.cwd()}/${outputPath}`

      if (fs.existsSync(outputPath)) {
        console.log(`File ${outputPath} already exists, please remove it first.`)
        process.exit(1)
      }
      const content = JSON.stringify(errors, null, 2)
      fs.writeFileSync(outputPath, content, err => {
        if (err) {
          console.error(`Could not write to ${outputPath}`)
          console.error(err)
        }
      })
    }
  }

  // checks for --show-human-readable
  const humanReadableIndex = process.argv.indexOf('--human-readable')
  if (humanReadableIndex > -1) {
    // map per path
    const errorsPerPath = []
    for (const error of errors) {
      if (!errorsPerPath[error.location.path]) {
        errorsPerPath[error.location.path] = []
      }
      errorsPerPath[error.location.path].push(error)
    }

    for (const [path, errorsForPath] of Object.entries(errorsPerPath)) {
      console.log(path)
      for (const error of errorsForPath) {
        console.log(`  ${error.location.positions.begin.line}:${error.location.positions.begin.column} ${error.description}`)
      }
      console.log()
    }

    console.log(`${errors.length} problems`)

    process.exit(1)
  }

  console.log(JSON.stringify(errors, null, 2))
  process.exit(1)
}))
