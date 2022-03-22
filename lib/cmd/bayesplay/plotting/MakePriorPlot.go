package plotting

import "pkg/bayesfactor"
func MakePriorPlot(prior bayesfactor.PriorDefinition) interface{} {

	var priorPlotData interface{}
	switch prior.Name {
	case "normal":
		priorPlotData = DnormPlotPrior(prior.Params[0], prior.Params[1], prior.Params[2], prior.Params[3])
	case "student_t":
		priorPlotData = StudentTPriorPlot(prior.Params[0], prior.Params[1], prior.Params[2], prior.Params[3], prior.Params[4])
	case "beta":
		priorPlotData = DbetaPlotPrior(prior.Params[0], prior.Params[1])
	case "cauchy":
		priorPlotData = CauchyPriorPlot(prior.Params[0], prior.Params[1], prior.Params[2], prior.Params[3])
	case "uniform":
		priorPlotData = UniformPriorPlot(prior.Params[0], prior.Params[1])
	case "point":
		result := []interface{}{}
		res := map[string]interface{}{"x": prior.Params[0], "y": 1}
		result = append(result, res)
		priorPlotData = result

	}

	return priorPlotData
}
