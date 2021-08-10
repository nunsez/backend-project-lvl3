FILEPATH=$(CURDIR)/dist/bin/page-loader.js
LINKPATH=~/.local/bin/page-loader

install:
	yarn install

dev:
	yarn tsc --watch

compile:
	yarn tsc

start:
	yarn node dist/bin/page-loader.js $(ARGS)

test:
	yarn jest

unlink:
	[ -f $(LINKPATH) ] && rm $(LINKPATH)

link: unlink
	ln -s $(FILEPATH) $(LINKPATH)


.PHONY: test
