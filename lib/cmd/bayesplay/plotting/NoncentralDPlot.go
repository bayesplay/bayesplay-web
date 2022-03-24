package plotting

import (
	"math"
	"pkg/bayesfactor"
)

func NoncentralDPlot(d float64, n float64) interface{} {
	df := n - 1
	variance := (df+df+2)/((df+1)*(df+1)) + ((d * d) / (2 * (df + df + 2)))
	sd := math.Sqrt(variance)
	min := d - 4*sd // min range of plot
	max := d + 4*sd // max range  of plot
	result := []interface{}{}

	likelihoodFunction := bayesfactor.NoncentralDLikelihood(d, n)

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
