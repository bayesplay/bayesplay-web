package plotting

import "pkg/bayesfactor"
func MakeLikelihoodPlotData(likelihood bayesfactor.LikelihoodDefinition) interface{} {

	var likelihoodPlotData interface{}
	switch likelihood.Name {
	case "normal":
		likelihoodPlotData = DnormPlot(likelihood.Params[0], likelihood.Params[1])
	case "student_t":
		likelihoodPlotData = ScaledShiftedTPlot(likelihood.Params[0], likelihood.Params[1], likelihood.Params[2])
	case "binomial":
		likelihoodPlotData = DbinomPlot(likelihood.Params[0], likelihood.Params[1])
	case "noncentral_t":
		likelihoodPlotData = NoncentralTPlot(likelihood.Params[0], likelihood.Params[1])
	case "noncentral_d":
		likelihoodPlotData = NoncentralDPlot(likelihood.Params[0], likelihood.Params[1])
	case "noncentral_d2":
		likelihoodPlotData = NoncentralD2Plot(likelihood.Params[0], likelihood.Params[1], likelihood.Params[2])
	}
	return likelihoodPlotData
}
