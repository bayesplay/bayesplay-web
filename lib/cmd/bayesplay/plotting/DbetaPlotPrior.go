package plotting

import (
	"pkg/bayesfactor"
)

func DbetaPlotPrior(alpha float64, beta float64) interface{} {

	min := 0.0
	max := 1.0
	result := []interface{}{}

	priorFunction := bayesfactor.BetaPrior(alpha, beta, min, max).Function

	step := (max - min) / 100
	x := min
	for i := 0; i < 101; i++ {
		y := priorFunction(x)
		if i == 0 {
			y = priorFunction(x + step)
		}
		if i == 100 {
			y = priorFunction(x - step)
			x = 1
		}

		res := map[string]interface{}{"x": x, "y": y}
		result = append(result, res)
		x += step
	}

	return result
}
