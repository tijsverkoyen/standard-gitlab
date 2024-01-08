# standard-gitlab

> A formatter for [StandardJS](https://standardjs.com) that outputs a GitLab Code Quality compatible report.

## Install

Using [npm](https://www.npmjs.com/get-npm):

```bash
npm install --save-dev standard-gitlab
```

## Usage

### CLI

```bash
standard | standard-gitlab
```

### `.gitlab-ci.yaml`

```yaml
StandardJS - check code styling:
  image: XXX
  script:
    - standard | standard-gitlab -o standardjs-report.json --human-readable
  artifacts:
    expire_in: 1 week
    reports:
      codequality: standardjs-report.json
```

## Options

### `-o, --output <file>`

Write the report to a file instead of `stdout`.

### `--human-readable`

Output a human readable report to `stdout` instead of a JSON report. So you can use it in a pipeline.
