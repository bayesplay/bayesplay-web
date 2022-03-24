package plotting

import (
	"bayesplay/helpers"
	"math"
	"pkg/bayesfactor"
)

var seqSteps = helpers.SeqSteps
var seqShort = helpers.SeqShort

func PredictionZip(alt interface{}, null interface{}) interface{} {

	comparison2 := []interface{}{}
	items := len(null.([]interface{}))
	for i := 0; i < items; i++ {

		obalt := helpers.GetElementByIndex(alt, i, "x").(float64)
		obnull := helpers.GetElementByIndex(null, i, "x").(float64)

		altPrediction := helpers.GetElementByIndex(alt, i, "y").(float64)
		nullPrediction := helpers.GetElementByIndex(null, i, "y").(float64)
		altValue := map[string]interface{}{"x": obalt, "y": altPrediction, "type": "Alternative model"}
		nullValue := map[string]interface{}{"x": obnull, "y": nullPrediction, "type": "Null model"}
		comparison2 = append(comparison2, altValue)
		comparison2 = append(comparison2, nullValue)

	}

	return comparison2

}

func PredictionRatio(alt interface{}, null interface{}) interface{} {

	ratio := []interface{}{}
	items := len(null.([]interface{}))
	for i := 0; i < items; i++ {
		ob := helpers.GetElementByIndex(alt, i, "x").(float64)
		altPrediction := helpers.GetElementByIndex(alt, i, "y").(float64)
		nullPrediction := helpers.GetElementByIndex(null, i, "y").(float64)
		thisBf := math.Log10(altPrediction) - math.Log10(nullPrediction)
		ratioValue := map[string]interface{}{"x": ob, "y": thisBf}
		ratio = append(ratio, ratioValue)

	}

	return ratio

}


func GeneratePredictions(likelihood bayesfactor.LikelihoodDefinition,
	altprior bayesfactor.PriorDefinition,
	nullprior bayesfactor.PriorDefinition, minvalue float64,
	maxvalue float64,
) (interface{}, interface{}) {

	alt := []interface{}{}
	null := []interface{}{}

	var observations []float64
	if likelihood.Name == "binomial" {
		trials := likelihood.Params[1]
		observations = seqSteps(0, trials+1, 1)
	} else {
		observations = seqShort(minvalue, maxvalue)
		// sort.Float64s(observations)
	}

	for _, ob := range observations {
		likelihood.Params[0] = ob
		altPrediction := bayesfactor.Pp(likelihood, altprior).Auc
		nullPrediction := bayesfactor.Pp(likelihood, nullprior).Auc
		altValue := map[string]interface{}{"x": ob, "y": altPrediction, "type": "Alternative model"}
		alt = append(alt, altValue)
		nullValue := map[string]interface{}{"x": ob, "y": nullPrediction, "type": "Null model"}
		null = append(null, nullValue)
	}
	return alt, null
}





