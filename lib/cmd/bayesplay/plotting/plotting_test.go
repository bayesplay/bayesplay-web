package plotting

import (
	"bayesplay/helpers"
	"math"
	"pkg/bayesfactor"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func compare(t *testing.T, got, want float64, msg string) {

	const tolerance = .001
	opt := cmp.Comparer(func(x, y float64) bool {
		diff := math.Abs(x - y)
		mean := math.Abs(x+y) / 2.0
		return (diff / mean) < tolerance
	})

	if !cmp.Equal(got, want, opt) {
		t.Fatalf("TEST %s : got %v, wanted %v", msg, got, want)
	}
}

var GetElementByIndex = helpers.GetElementByIndex

func TestPlotSize(t *testing.T) {

	// likelihood
	compare(t, float64(len(DnormPlot(0, 1).([]interface{}))), 101, "normal")
	compare(t, float64(len(DbinomPlot(0, 1).([]interface{}))), 101, "binomial")
	compare(t, float64(len(NoncentralDPlot(0, 20).([]interface{}))), 101, "noncentral d")
	compare(t, float64(len(NoncentralD2Plot(0, 10, 10).([]interface{}))), 101, "noncentral d2")
	compare(t, float64(len(NoncentralTPlot(0, 20).([]interface{}))), 101, "noncentral t")
	compare(t, float64(len(ScaledShiftedTPlot(0, 20, 40).([]interface{}))), 101, "student t")

	// priors
	compare(t, float64(len(DnormPlotPrior(0, 1, math.Inf(-1), math.Inf(1)).([]interface{}))), 101, "normal")
	compare(t, float64(len(StudentTPriorPlot(0, 10, 10, math.Inf(-1), math.Inf(1)).([]interface{}))), 101, "noncentral d2")
	compare(t, float64(len(DbetaPlotPrior(1, 1).([]interface{}))), 101, "beta")
	compare(t, float64(len(CauchyPriorPlot(0, 10, math.Inf(-1), math.Inf(1)).([]interface{}))), 101, "uniform")
	compare(t, float64(len(UniformPriorPlot(-10, 10).([]interface{}))), 101, "noncentral t")

}

func TestPlotFunctions(t *testing.T) {

	plotData := DnormPlot(0, 1)
	compare(t, GetElementByIndex(plotData, 100, "x").(float64), 4, "normal plot x 100")
	compare(t, GetElementByIndex(plotData, 0, "x").(float64), -4, "normal plot x 0")

	compare(t, GetElementByIndex(plotData, 100, "y").(float64), 0.0001338302, "normal plot y 100")
	compare(t, GetElementByIndex(plotData, 0, "y").(float64), 0.0001338302, "normal plot y 0")

	plotData = CauchyPriorPlot(0, 1, math.Inf(-1), math.Inf(1))
	compare(t, GetElementByIndex(plotData, 100, "x").(float64), 4, "cauchy prior x 100")
	compare(t, GetElementByIndex(plotData, 0, "x").(float64), -4, "cauchy prior x 0")

	compare(t, GetElementByIndex(plotData, 100, "y").(float64), 0.01872411, "cauchy prior y 100")
	compare(t, GetElementByIndex(plotData, 0, "y").(float64), 0.01872411, "cauchy prior y 0")

	}

func TestPlotPrediction(t *testing.T) {

	// likelihood
	var likelihood bayesfactor.LikelihoodDefinition
	var altprior bayesfactor.PriorDefinition
	var nullprior bayesfactor.PriorDefinition

	likelihood.Name = "binomial"
	likelihood.Params = []float64{2, 10}

	// alt prior
  // altprior.Name = "beta"
  // altprior.Params = []float64{0.5, 1}
	altprior.Name = "point"
	altprior.Params = []float64{0.8}


	// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.5}

	predAlt := bayesfactor.Pp(likelihood, altprior)
	predNull := bayesfactor.Pp(likelihood, nullprior)
	nulldata := MakePriorPlot(nullprior)
  t.Log(nulldata)
	altdata := MakePriorPlot(altprior)
  t.Log(altdata)
	likdata := MakeLikelihoodPlotData(likelihood)
	nullMin, nullMax, altMin, altMax := PosteriorLimits(nulldata, altdata)
  t.Log(nullMin)
  t.Log(nullMax)
  t.Log(altMin)
  t.Log(altMax)

	MakePosteriorPlot(altMin, altMax, predAlt)
	MakePosteriorPlot(nullMin, nullMax, predNull)

	xmin, xmax := PredictionLimits(likdata, altdata, nulldata)
	alt, null := GeneratePredictions(likelihood, altprior, nullprior, xmin, xmax)


	PredictionZip(alt, null)
	PredictionRatio(alt, null)



}
