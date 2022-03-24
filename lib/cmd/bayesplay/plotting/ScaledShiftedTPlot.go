package plotting

import "pkg/bayesfactor"

func ScaledShiftedTPlot(mean float64, sd float64, df float64) interface{} {

	min := mean - 4*sd // min range of plot
	max := mean + 4*sd // max range  of plot
	result := []interface{}{}

	likelihoodFunction := bayesfactor.StudentTLikelihood(mean, sd, df)

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
