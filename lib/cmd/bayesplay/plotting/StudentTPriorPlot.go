package plotting

import "pkg/bayesfactor"
func StudentTPriorPlot(mean float64, sd float64, df float64, min float64, max float64) interface{} {

	minRange := mean - 4*sd // min range of plot
	maxRange := mean + 4*sd // max range  of plot
	result := []interface{}{}

	priorFunction := bayesfactor.StudentTPrior(mean, sd, df, min, max).Function

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
