package plotting

import "pkg/bayesfactor"

func CauchyPriorPlot(location float64, scale float64, min float64, max float64) interface{} {

	result := []interface{}{}

	minRange := location - 4*scale // min range of plot
	maxRange := location + 4*scale // max range  of plot

	priorFunction := bayesfactor.CauchyPrior(location, scale, min, max).Function

	step := (maxRange - minRange) / 100
	x := minRange
	for i := 0; i < 101; i++ {
		y := priorFunction(x)
		res := map[string]interface{}{"x": x, "y": y}
		result = append(result, res)
		x += step
	}

	return result
}
