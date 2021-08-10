install:
	yarn install

dev:
	yarn tsc --watch

start:
	yarn node dist/bin/page-loader.js $(ARGS)

test:
	yarn jest

.PHONY: test
