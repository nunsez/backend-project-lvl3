FILEPATH=$(CURDIR)/bin/page-loader.js
LINKPATH=~/.local/bin/page-loader
OUTPUTDIR=dist

install:
	yarn install

dev:
	yarn babel src -w -d $(OUTPUTDIR) -x ".ts" --delete-dir-on-start --copy-files

build:
	yarn babel src -d $(OUTPUTDIR) -x ".ts" --delete-dir-on-start --copy-files --verbose

start:
	yarn node bin/page-loader.js $(ARGS)

test:
	yarn jest --watch

unlink:
	if [ -f $(LINKPATH) ]; then rm $(LINKPATH); fi

link: unlink
	ln -s $(FILEPATH) $(LINKPATH)


.PHONY: test
