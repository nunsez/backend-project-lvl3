# Hexlet. PageLoader. Backend project lvl 3.

[![Actions Status](https://github.com/nunsez/backend-project-lvl3/workflows/hexlet-check/badge.svg)](https://github.com/nunsez/backend-project-lvl3/actions) &nbsp;
[![Node.js CI](https://github.com/nunsez/backend-project-lvl3/actions/workflows/node.js.yml/badge.svg)](https://github.com/nunsez/backend-project-lvl3/actions/workflows/node.js.yml) &nbsp;
[![Maintainability](https://api.codeclimate.com/v1/badges/cf5f4d19e3d3ec2e91f7/maintainability)](https://codeclimate.com/github/nunsez/backend-project-lvl3/maintainability) &nbsp;
[![Test Coverage](https://api.codeclimate.com/v1/badges/cf5f4d19e3d3ec2e91f7/test_coverage)](https://codeclimate.com/github/nunsez/backend-project-lvl3/test_coverage)

**PageLoader** - a command line utility that downloads pages from the Internet and saves them to your computer. Together with the page, it downloads all assets (images, styles and js) making it possible to open the page without the Internet. The same principle is used to save pages in the browser.

**Utility features:**

- Support the directory choice to save the page
- Parallel downloading of assets
- Showing download progress

## Requirements
- GNU Make
- Node (v.16+)
- Yarn (v.1.22+)

## Install

```sh
git clone https://github.com/nunsez/backend-project-lvl3.git
cd backend-project-lvl3/
make install
make link
```

## Run tests

```sh
make test
make test-coverage
```

## Usage examples

### Output help information

[![asciicast](https://asciinema.org/a/431722.svg)](https://asciinema.org/a/431722)

### Workflow

[![asciicast](https://asciinema.org/a/431719.svg)](https://asciinema.org/a/431719)

### Debug

[![asciicast](https://asciinema.org/a/431720.svg)](https://asciinema.org/a/431720)
