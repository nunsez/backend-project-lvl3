install:
	yarn install

dev:
	yarn tsc --watch

start:
	yarn node dist/bin/page-loader.js $(ARGS)

test:
	yarn jest

unlink:
	rm ~/.local/bin/page-loader

link: unlink
	ln -s $(CURDIR)/dist/bin/page-loader.js ~/.local/bin/page-loader


.PHONY: test
