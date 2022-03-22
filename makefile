web_source := $(shell  find web/src)
./web/build/index.js: $(web_source)
	@echo "Building web"
	@cd web; \
		yarn build

.PHONY: web_tests
web_tests: ./web/build/index.js
	@echo "Running web tests..."
	@echo "Make sure Docker daemon is running..."
	@cd web;\
		yarn test
