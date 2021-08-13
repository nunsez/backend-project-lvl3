OUTPUTDIR=dist

install: install-deps build

install-deps:
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
	yarn jest $(args)

TDD:
	yarn jest --watch

test-coverage:
	yarn jest --coverage

unlink:
	yarn unlink

link: unlink
	yarn link


.PHONY: test
