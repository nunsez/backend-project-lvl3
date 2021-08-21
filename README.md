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

## PageLoader API

You can import the utility as a Promise:

```javascript
import pageLoader from 'pageLoader';

pageLoader(url, dirName).then((htmlPath) => console.log(htmlPath));
```

First arguments `<url>` is the string of web page address. It's required.

The second argument `[dirName]` is a string and is optional. It determines in which directory on your filesystem the page will be loaded.
The default value is the current directory (`process.cwd()`)

## Usage examples

### Output help information
_...work in progress_
