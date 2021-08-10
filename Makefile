install:
	yarn install

dev:
	yarn tsc --watch

start:
	node dist/bin/page-loader.js $(ARGS)
