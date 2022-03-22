package main

import (
	"bayesplay/helpers"
	"bayesplay/plotting"
	"errors"
	"fmt"
	"pkg/bayesfactor"
	"pkg/distributions"

	"math"
	"syscall/js"
)

// alias plotting functions
var MakePosteriorPlot = plotting.MakePosteriorPlot
var MakePriorPlot = plotting.MakePriorPlot
var GeneratePredictions = plotting.GeneratePredictions
var PosteriorLimits = plotting.PosteriorLimits
var PredictionLimits = plotting.PredictionLimits

// alias helper functions
var GetElementByIndex = helpers.GetElementByIndex
var MinMax = helpers.MinMax

func main() {

	fmt.Println("Loaded WASM...")

	// computations
	js.Global().Set("bayesfactor", js.FuncOf(bfWrapper))     // bf only
	js.Global().Set("computeAll", js.FuncOf(computeWrapper)) // compute all

	// likelihoods
	js.Global().Set("dnormPlot", js.FuncOf(dnormPlotWrapper))                     // normal likelihood
	js.Global().Set("scaled_shifted_tPlot", js.FuncOf(scaledShiftedTPlotWrapper)) // student t likelihood
	js.Global().Set("dbinomPlot", js.FuncOf(dbinomPlotWrapper))                   // binomial likelihood
	js.Global().Set("noncentral_tPlot", js.FuncOf(noncentralTPlotWrapper))        // noncentral t likelihood
	js.Global().Set("noncentral_dPlot", js.FuncOf(noncentralDPlotWrapper))        // noncentral d likelhood
	js.Global().Set("noncentral_d2Plot", js.FuncOf(noncentralD2PlotWrapper))      // noncentral d2 likelihood

	// priors
	js.Global().Set("dnormPlotPrior", js.FuncOf(dnormPriorPlotWrapper))        // normal prior
	js.Global().Set("student_tPlotPrior", js.FuncOf(studentTPriorPlotWrapper)) // student t prior
	js.Global().Set("dbetaPlotPrior", js.FuncOf(dbetaPriorPlotWrapper))        // beta prior
	js.Global().Set("cauchyPlot_Prior", js.FuncOf(cauchyPriorPlotWrapper))     // cauchy prior
	js.Global().Set("uniformPriorPlot", js.FuncOf(uniformPriorPlotWrapper))    // uniform prior

	js.Global().Set("loaded", "true")
	<-make(chan bool)

	fmt.Printf("done")
}

// type JsonDemo struct {
// 	X int `json:"x"`
// 	Y int `json:"y"`
// }
//
// type InputDemo struct {
// 	L float64
// 	P float64
// }
//
// func demoWrapper(this js.Value, args []js.Value) interface{} {
// 	fmt.Println("hellow")
// 	var inputDemo InputDemo
// 	json.Unmarshal([]byte(string(args[0].String())), &inputDemo)
// 	fmt.Println(inputDemo.L + 1)
// 	if inputDemo.L == 0 {
// 		fmt.Println("L is null")
// 	}
// 	tmp := make([]JsonDemo, 10)
// 	for i := range tmp {
// 		tmp[i].X = rand.Intn(100)
// 		tmp[i].Y = rand.Intn(100)
// 	}
// 	// tmp_marshalled, _ := json.Marshal(&tmp)
//
// 	// return string(tmp_marshalled)
// 	return nil
// }

func getParam(arg js.Value, field string) (js.Value, error) {

	if arg.Get(field).IsUndefined() {
		return arg, errors.New("missing field")
	} else if arg.Get(field).IsNull() {
		return arg, errors.New("missing field")
	} else if arg.Get(field).IsNaN() {
		return arg, errors.New("missing field")
	} else {
		return arg.Get(field), nil
	}
}

func getMinMax(arg js.Value, field string, likelihoodName string) float64 {

	var val float64
	var defaultval float64

	if likelihoodName == "binomial" && field == "min" {
		defaultval = 0
	} else if likelihoodName == "binomial" && field == "max" {
		defaultval = 1
	} else if likelihoodName != "binomial" && field == "min" {
		defaultval = math.Inf(-1)
	} else if likelihoodName != "binomial" && field == "max" {
		defaultval = math.Inf(1)
	}

	if arg.Get("parameters").Get(field).IsNull() {
		val = defaultval
	} else if arg.Get("parameters").Get(field).IsNaN() {
		val = defaultval
	} else if arg.Get("parameters").Get(field).IsUndefined() {
		val = defaultval
	} else {
		val = arg.Get("parameters").Get(field).Float()
	}
	return val

}

// COPIED

func dnormPlotWrapper(this js.Value, args []js.Value) interface{} {
	mean := args[0].Float()
	sd := args[1].Float()
	return plotting.DnormPlot(mean, sd)
}

func dnormPriorPlotWrapper(this js.Value, args []js.Value) interface{} {

	mean := args[0].Float()
	sd := args[1].Float()
	var min float64
	var max float64
	if args[2].IsNull() {
		min = math.Inf(-1)
	} else {
		min = args[2].Float()
	}
	if args[3].IsNull() {
		max = math.Inf(1)
	} else {
		max = args[3].Float()
	}
	return plotting.DnormPlotPrior(mean, sd, min, max)
}

func studentTPriorPlotWrapper(this js.Value, args []js.Value) interface{} {

	mean := args[0].Float()
	sd := args[1].Float()
	df := args[2].Float()
	var min float64
	var max float64
	if args[3].IsNull() {
		min = math.Inf(-1)
	} else {
		min = args[3].Float()
	}
	if args[4].IsNull() {
		max = math.Inf(1)
	} else {
		max = args[4].Float()
	}

	return plotting.StudentTPriorPlot(mean, sd, df, min, max)
}

func cauchyPriorPlotWrapper(this js.Value, args []js.Value) interface{} {

	location := args[0].Float()
	scale := args[1].Float()

	var min float64
	var max float64
	if args[2].IsNull() {
		min = math.Inf(-1)
	} else {
		min = args[2].Float()
	}
	if args[3].IsNull() {
		max = math.Inf(1)
	} else {
		max = args[3].Float()
	}
	return plotting.CauchyPriorPlot(location, scale, min, max)
}

func dbinomPlotWrapper(this js.Value, args []js.Value) interface{} {
	x := args[0].Float()
	n := args[1].Float()
	return plotting.DbinomPlot(x, n)
}

func dbetaPriorPlotWrapper(this js.Value, args []js.Value) interface{} {

	alpha := args[0].Float()
	beta := args[1].Float()
	return plotting.DbetaPlotPrior(alpha, beta)
}

func uniformPriorPlotWrapper(this js.Value, args []js.Value) interface{} {

	alpha := args[0].Float()
	beta := args[1].Float()
	return plotting.UniformPriorPlot(alpha, beta)
}

func scaledShiftedTPlotWrapper(this js.Value, args []js.Value) interface{} {

	mean := args[0].Float()
	sd := args[1].Float()
	df := args[2].Float()
	return plotting.ScaledShiftedTPlot(mean, sd, df)
}

func noncentralDPlotWrapper(this js.Value, args []js.Value) interface{} {

	d := args[0].Float()
	n := args[1].Float()
	return plotting.NoncentralDPlot(d, n)

}

func noncentralD2PlotWrapper(this js.Value, args []js.Value) interface{} {

	d := args[0].Float()
	n1 := args[1].Float()
	n2 := args[2].Float()
	return plotting.NoncentralD2Plot(d, n1, n2)

}

// var noncentralTLikelihood = bayesfactor.NoncentralTLikelihood

func noncentralTPlotWrapper(this js.Value, args []js.Value) interface{} {

	t := args[0].Float()
	df := args[1].Float()
	return plotting.NoncentralTPlot(t, df)
}

func dbetaWrapper(this js.Value, args []js.Value) interface{} {
	x := args[0].Float()
	shape1 := args[1].Float()
	shape2 := args[2].Float()
	return distributions.Dbeta(x, shape1, shape2)
}

func dbinomWrapper(this js.Value, args []js.Value) interface{} {
	x := args[0].Float()
	n := args[1].Float()
	p := args[2].Float()
	return distributions.Dbinom(x, n, p)
}

func scaledShiftedTWrapper(this js.Value, args []js.Value) interface{} {
	if len(args) < 4 {
		return nil
	}
	var x float64
	var mean float64
	var sd float64
	var df float64
	x = args[0].Float()
	mean = args[1].Float()
	sd = args[2].Float()
	df = args[3].Float()
	return distributions.ScaledShiftedT(x, mean, sd, df)
}

// COPIED TWO
func bfWrapper(this js.Value, args []js.Value) interface{} {

	likelihood, err := parseLikelihood(args)
	altprior, err := parsePrior(args, "altpriorDef", likelihood.Name)
	nullprior, err := parsePrior(args, "nullpriorDef", likelihood.Name)
	if err != nil {
		return nil
	}
	bf, err := bayesfactor.Bayesfactor(likelihood, altprior, nullprior)
	if err != nil {
		return nil
	}
	return bf
}

func computeWrapper(this js.Value, args []js.Value) interface{} {

	// parse the model
	likelihood, altprior, nullprior := parseFullModel(args)

	// compute the bf
	bf, _ := bayesfactor.Bayesfactor(likelihood, altprior, nullprior)
	// make the likelhood plot data

	likelihoodPlotData := plotting.MakeLikelihoodPlotData(likelihood)

	// extract the observation from the likelhood
	observation := likelihood.Params[0]

	// make prior plot data
	altpriorPlotData := MakePriorPlot(altprior)
	nullpriorPlotData := MakePriorPlot(nullprior)

	// find posterior plot limits
	nullMin, nullMax, altMin, altMax := PosteriorLimits(nullpriorPlotData, altpriorPlotData)
	// find prediction plot limit
	xmin, xmax := PredictionLimits(likelihoodPlotData, altpriorPlotData, nullpriorPlotData)

	// get the product of the prior and likelihood
	altPriorProd := bayesfactor.Pp(likelihood, altprior)
	nullPriorProd := bayesfactor.Pp(likelihood, nullprior)

	// make the posterior plot
	altPosteriorPlot := MakePosteriorPlot(altMin, altMax, altPriorProd)
	nullPosteriorPlot := MakePosteriorPlot(nullMin, nullMax, nullPriorProd)

	alt, null := GeneratePredictions(likelihood, altprior, nullprior, xmin, xmax)

	// make the visual comparison
	comparison := plotting.PredictionZip(alt, null)
	// make the ratio plot
	ratio := plotting.PredictionRatio(alt, null)

	// get observation values for alt and null model
	altPoint := altPriorProd.Auc
	nullPoint := nullPriorProd.Auc

	// output a big json object for javascript to work with
	result := map[string]interface{}{
		"bf": bf,
		// likelhood
		"likelihoodPlotData": likelihoodPlotData,
		// priors
		"altpriorPlotData":  altpriorPlotData,
		"nullpriorPlotData": nullpriorPlotData,
		// posteriors
		"altposteriorPlotData":  altPosteriorPlot,
		"nullposteriorPlotData": nullPosteriorPlot,

		// names of the alt and null families
		"names": map[string]interface{}{"likelihoodName": likelihood.Name, "alt": altprior.Name, "null": nullprior.Name},

		// the current observation
		"observation": observation,
		"altpoint":    altPoint,
		"nullpoint":   nullPoint,

		// the comparison plot
		"comparison": comparison,

		// the ratio plot
		"ratio": ratio,
	}

	return result
}

// COPIED THREE
func parseLikelihood(args []js.Value) (bayesfactor.LikelihoodDefinition, error) {

	var likelihood bayesfactor.LikelihoodDefinition // likelihood

	likelihoodObj, err := getParam(args[0], "likelihoodDef")

	if err != nil {
		fmt.Println("missing likelhood")
		return likelihood, errors.New("missing likelihood")
	}

	likelihoodName := likelihoodObj.Get("distribution").String()

	switch likelihoodName {
	case "normal":
		likelihood.Name = "normal"
		mean := likelihoodObj.Get("parameters").Get("mean").Float()
		sd := likelihoodObj.Get("parameters").Get("sd").Float()
		likelihood.Params = []float64{mean, sd}
	case "student t":
		likelihood.Name = "student_t"
		mean := likelihoodObj.Get("parameters").Get("mean").Float()
		sd := likelihoodObj.Get("parameters").Get("sd").Float()
		df := likelihoodObj.Get("parameters").Get("df").Float()
		likelihood.Params = []float64{mean, sd, df}
	case "binomial":
		likelihood.Name = "binomial"
		successes := likelihoodObj.Get("parameters").Get("successes").Float()
		trials := likelihoodObj.Get("parameters").Get("trials").Float()
		likelihood.Params = []float64{successes, trials}
	case "noncentral t":
		likelihood.Name = "noncentral_t"
		t := likelihoodObj.Get("parameters").Get("t").Float()
		df := likelihoodObj.Get("parameters").Get("df").Float()
		likelihood.Params = []float64{t, df}
	case "noncentral d":
		likelihood.Name = "noncentral_d"
		d := likelihoodObj.Get("parameters").Get("d").Float()
		n := likelihoodObj.Get("parameters").Get("n").Float()
		likelihood.Params = []float64{d, n}
	case "noncentral d2":
		likelihood.Name = "noncentral_d2"
		d := likelihoodObj.Get("parameters").Get("d").Float()
		n1 := likelihoodObj.Get("parameters").Get("n1").Float()
		n2 := likelihoodObj.Get("parameters").Get("n2").Float()
		likelihood.Params = []float64{d, n1, n2}
	}

	return likelihood, nil
}

// parse_prior
func parsePrior(args []js.Value, priorType string, likelihoodName string) (bayesfactor.PriorDefinition, error) {

	var nullprior bayesfactor.PriorDefinition // null prior
	nullpriorObj, _ := getParam(args[0], priorType)
	nullPriorName := nullpriorObj.Get("distribution").String()

	switch nullPriorName {
	case "normal":
		nullprior.Name = "normal"
		mean := nullpriorObj.Get("parameters").Get("mean").Float()
		sd := nullpriorObj.Get("parameters").Get("sd").Float()
		min := getMinMax(nullpriorObj, "min", likelihoodName)
		max := getMinMax(nullpriorObj, "max", likelihoodName)
		nullprior.Params = []float64{mean, sd, min, max}
	case "student t":
		nullprior.Name = "student_t"
		mean := nullpriorObj.Get("parameters").Get("mean").Float()
		sd := nullpriorObj.Get("parameters").Get("sd").Float()
		df := nullpriorObj.Get("parameters").Get("df").Float()
		min := getMinMax(nullpriorObj, "min", likelihoodName)
		max := getMinMax(nullpriorObj, "max", likelihoodName)
		nullprior.Params = []float64{mean, sd, df, min, max}
	case "beta":
		nullprior.Name = "beta"
		alpha := nullpriorObj.Get("parameters").Get("alpha").Float()
		beta := nullpriorObj.Get("parameters").Get("beta").Float()
		nullprior.Params = []float64{alpha, beta}
	case "cauchy":
		nullprior.Name = "cauchy"
		location := nullpriorObj.Get("parameters").Get("location").Float()
		scale := nullpriorObj.Get("parameters").Get("scale").Float()
		min := getMinMax(nullpriorObj, "min", likelihoodName)
		max := getMinMax(nullpriorObj, "max", likelihoodName)
		nullprior.Params = []float64{location, scale, min, max}
	case "uniform":
		nullprior.Name = "uniform"
		alpha := nullpriorObj.Get("parameters").Get("minimum").Float()
		beta := nullpriorObj.Get("parameters").Get("maximum").Float()
		nullprior.Params = []float64{alpha, beta}
	case "point":
		nullprior.Name = "point"
		point := nullpriorObj.Get("parameters").Get("point").Float()
		nullprior.Params = []float64{point}
	default:
		return nullprior, nil
	}

	return nullprior, nil

}

func parseFullModel(args []js.Value) (bayesfactor.LikelihoodDefinition, bayesfactor.PriorDefinition, bayesfactor.PriorDefinition) {

	fullmodel := make([]js.Value, 1)
	fullmodel[0] = args[0]
	likelihood, _ := parseLikelihood(fullmodel)
	altprior, _ := parsePrior(args, "altpriorDef", likelihood.Name)
	nullprior, _ := parsePrior(fullmodel, "nullpriorDef", likelihood.Name)
	return likelihood, altprior, nullprior

}
