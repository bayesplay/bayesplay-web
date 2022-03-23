web_source := $(shell  find web/src)
./web/build/index.js: $(web_source)
	@echo "Building web"
	@cd web; \
		yarn install
	@cd web; \
		yarn build

.PHONY: web_tests
web_tests: ./web/build/index.js
	@echo "Running web tests..."
	@echo "Make sure Docker daemon is running..."
	@cd web;\
		yarn test

main.wasm :
	cd lib/cmd/bayesplay; \
		tinygo build -o ../../dist/main.wasm -target=wasm -opt=z -gc=leaking -no-debug main.go
		# tinygo build -o ../../dist/main.wasm -target=wasm -opt=z -gc=leaking -scheduler=coroutines -no-debug main.go

backend_tests :
	@echo "Starting Tests!"
	@echo "testing distributions..."
	@cd lib/pkg/distributions/; \
		go test -v -covermode=atomic
	@echo "testing bayesfactor.."
	@cd lib/pkg/bayesfactor/; \
		go test -v -covermode=atomic
	@echo "testing bayesplay/plotting"
	@cd lib/cmd/bayesplay/plotting; \
		go test -v -covermode=atomic
	@echo "Finished Tests!"

dist : main.wasm
	cp lib/dist/main.wasm ./web/public/main.wasm
	cp ./lib/dist/tinygo.js ./web/public/wasm_exec.js

tests : backend_tests web_tests

web : dist 
	@echo "Building web"
	@cd web; \
		yarn install
	@cd web; \
		yarn build

