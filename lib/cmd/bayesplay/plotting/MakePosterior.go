package plotting

import (
	"bayesplay/helpers"
	"math"
	"pkg/bayesfactor"
)


var Seq = helpers.Seq
// MakePosteior generates the posterior plot data from a Predictive
func MakePosteriorPlot(xmin float64, xmax float64, pred bayesfactor.Predictive) []interface{} {


	posteriorPlot := []interface{}{}
	posteriorValues := Seq(xmin, xmax)
	for _, x := range posteriorValues {
		y := pred.Function(x) / pred.Auc
		if math.IsNaN(y) {
			y = 0
		}
		if math.IsInf(y, 1) {
			y = 0
		}

		if math.IsInf(y, -1) {

			y = 0

		}
		res := map[string]interface{}{"x": x, "y": pred.Function(x) / pred.Auc}
		posteriorPlot = append(posteriorPlot, res)
	}
	return posteriorPlot
}
