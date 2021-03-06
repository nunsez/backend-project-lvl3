OUTPUTDIR=dist


install: install-yarn build

hexlet-checks:
	npm install
	make build
	npx eslint --no-eslintrc --config eslintrc-hexlet.yml --fix dist
	sed -i '1i /* eslint-disable indent */' dist/loadPage.js

install-yarn:
	yarn install

dev:
	yarn babel src -w -d $(OUTPUTDIR) -x ".ts" --delete-dir-on-start --copy-files

build:
	yarn babel src -d $(OUTPUTDIR) -x ".ts" --delete-dir-on-start --copy-files --verbose

compile:
	yarn tsc

lint:
	yarn eslint .

test:
	DEBUG=$(debug) yarn jest $(args)

TDD:
	DEBUG=$(debug) yarn jest --watch

test-coverage:
	yarn jest --coverage

unlink:
	yarn unlink

link: unlink
	yarn link


.PHONY: test
