package plotting

import (
	"math"
	"pkg/bayesfactor"
)

func DbinomPlot(x float64, n float64) interface{} {

	min := 0.0
	max := 1.0
	result := []interface{}{}

	likelihoodFunction := bayesfactor.BinomialLikelihood(x, n)

	step := (max - min) / 100
	p := min
	for i := 0; i < 101; i++ {
		y := likelihoodFunction(p)

		if math.IsNaN(y) {
			if i == 0 {
				y = likelihoodFunction(p + step)
				p = 0
			}
			if i == 100 {
				y = likelihoodFunction(p - step)
				p = 1
			}
		}

		res := map[string]interface{}{"x": p, "y": y}
		result = append(result, res)
		p += step
	}

	return result
}
