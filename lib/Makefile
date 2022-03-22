main.wasm :
	cd cmd/bayesplay; \
		tinygo build -o ../../dist/main.wasm -target=wasm -opt=z -gc=leaking -scheduler=coroutines -no-debug main.go
		# GOOS=js GOARCH=wasm go build -o ../../dist/main.wasm
		# tinygo build -o ../../dist/main.wasm -target=wasm -opt=z -scheduler=coroutines -no-debug main.go
		# tinygo build -o ../../dist/main.wasm -target=wasm -no-debug main.go

tests :
	@echo "Starting Tests!"
	@echo "testing distributions..."
	@cd pkg/distributions/; \
		go test -v -covermode=atomic
	@echo "testing bayesfactor.."
	@cd pkg/bayesfactor/; \
		go test -v -covermode=atomic
	@echo "testing bayesplay/plotting"
	@cd cmd/bayesplay/plotting; \
		go test -v -covermode=atomic
	@echo "Finished Tests!"


clean : FORCE
	rm dist/main.wasm

FORCE :

all :
	make clean
	make tests
	make main.wasm

distribution :
	make main.wasm
	cp dist/main.wasm ../bayesplay-front-end/public/main.wasm	
	cp dist/tinygo.js ../bayesplay-front-end/public/wasm_exec.js
	# cp dist/go.js ../bayesplay-front-end/public/wasm_exec.js
