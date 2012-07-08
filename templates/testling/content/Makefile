node-test:
	./node_modules/.bin/tap --stderr ./test/unit.js

test:
	./node_modules/.bin/testem \
		--file testem.json \
		--debuglog testem.log \
		--debug 2> testem.err

.PHONY: test