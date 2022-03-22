package plotting

import (
	"math"
	"pkg/bayesfactor"
	"testing"

	_ "github.com/fatih/structs"
	"github.com/google/go-cmp/cmp"
)

func compareFloat(t *testing.T, got, want float64, msg string) {

	const tolerance = .001
	opt := cmp.Comparer(func(x, y float64) bool {
		diff := math.Abs(x - y)
		mean := math.Abs(x+y) / 2.0
		if math.IsNaN(diff / mean) {
			return true
		}
		return (diff / mean) < tolerance
	})

	if !cmp.Equal(got, want, opt) {
		// t.Fatalf("TEST %s : got %v, wanted %v", msg, got, want)
		t.Logf("TEST %s : got %v, wanted %v", msg, got, want)
		t.Fail()
	}
}


func BenchmarkGeneratePredictions(b *testing.B) {

	likelihood := bayesfactor.LikelihoodDefinition{
		Name:   "normal",
		Params: []float64{0, 5},
	}

	altprior := bayesfactor.PriorDefinition{
		Name:   "normal",
		Params: []float64{0, 5, math.Inf(-1), math.Inf(1)},
	}

	nullprior := bayesfactor.PriorDefinition{
		Name:   "point",
		Params: []float64{0.0},
	}

	minvalue := -4.0
	maxvalue := 4.0

	alt, null := GeneratePredictions(likelihood, altprior, nullprior, minvalue, maxvalue)
	PredictionZip(alt, null)
	PredictionRatio(alt, null)

}

