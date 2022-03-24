module bayesfactor

go 1.17

require github.com/google/go-cmp v0.5.6

require pkg/distributions v1.0.0

require (
	golang.org/x/exp v0.0.0-20191002040644-a1355ae1e2c3 // indirect
	gonum.org/v1/gonum v0.9.3 // indirect
	scientificgo.org/special v0.0.0 // indirect
)

replace pkg/distributions => ../distributions
