package plotting

import (
	"math"
	"pkg/bayesfactor"
)
func NoncentralTPlot(t float64, df float64) interface{} {

	d := t * math.Sqrt(df+1)
	variance := (df+df+2)/((df+1)*(df+1)) + ((d * d) / (2 * (df + df + 2)))
	sd := math.Sqrt(variance)
	min := t - 4*sd // min range of plot
	max := t + 4*sd // max range  of plot
	result := []interface{}{}

	likelihoodFunction := bayesfactor.NoncentralTLikelihood(t, df)

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
