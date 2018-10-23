all: build

.PHONY: build
build:
	@truffle migrate

.PHONY: start/testrpc
start/testrpc:
	@ganache-cli -m "raise fold coral resemble gather program legend regular rival learn vivid trust"

.PHONY: deploy
deploy:
	@truffle deploy

.PHONY: test
test:
	@truffle test
