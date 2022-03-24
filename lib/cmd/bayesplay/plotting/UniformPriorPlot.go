package plotting

import (
	"math"
	"pkg/bayesfactor"
)
func UniformPriorPlot(alpha float64, beta float64) interface{} {

	diff := math.Abs(alpha - beta)
	if diff <= 1 {
		diff = 2
	}
	min := alpha - (1.05 * diff)
	max := beta + (1.05 * diff)
	result := []interface{}{}

	priorFunction := bayesfactor.UniformPrior(alpha, beta).Function
	step := (max - min) / 100
	x := min
	for i := 0; i < 101; i++ {
		y := priorFunction(x)
		// y := inrange(x, alpha, beta)
		res := map[string]interface{}{"x": x, "y": y}
		result = append(result, res)
		x += step
	}

	return result
}
