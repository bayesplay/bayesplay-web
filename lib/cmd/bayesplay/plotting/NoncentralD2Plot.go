package plotting

import (
	"math"
	"pkg/bayesfactor"
)

func NoncentralD2Plot(d float64, n1 float64, n2 float64) interface{} {
	variance := (n1+n2)/((n1)*(n2)) + ((d * d) / (2 * (n1 + n2)))
	sd := math.Sqrt(variance)
	min := d - 4*sd // min range of plot
	max := d + 4*sd // max range  of plot
	result := []interface{}{}

	likelihoodFunction := bayesfactor.NoncentralD2Likelihood(d, n1, n2)

	step := (max - min) / 100
	x := min
	for i := 0; i < 101; i++ {
		y := likelihoodFunction(x)
		res := map[string]interface{}{"x": x, "y": y}
		result = append(result, res)
		x += step
	}

	return result
}
