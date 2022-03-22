package plotting

import (
	"bayesplay/helpers"
	"math"
)

func PosteriorLimits(nullData, altData interface{}) (float64, float64, float64, float64) {


	var altMin float64
	var altMax float64

	if len(altData.([]interface{})) == 1 {
    altMin = helpers.GetElementByIndex(altData, 0, "x").(float64) - 1
    altMax = helpers.GetElementByIndex(altData, 0, "x").(float64) + 1
	} else {
		altMin = helpers.GetElementByIndex(altData, 0, "x").(float64)
		altMax = helpers.GetElementByIndex(altData, 100, "x").(float64)
	}


	var nullMin float64
	var nullMax float64

	if len(nullData.([]interface{})) == 1 {
    altMin = helpers.GetElementByIndex(nullData, 0, "x").(float64) - 1
    altMax = helpers.GetElementByIndex(nullData, 0, "x").(float64) + 1
	} else {
		nullMin = helpers.GetElementByIndex(nullData, 0, "x").(float64)
		nullMax = helpers.GetElementByIndex(nullData, 100, "x").(float64)
	}
	return nullMin, nullMax, altMin, altMax
}

func PredictionLimits(likelihoodPlotData, altpriorPlotData, nullpriorPlotData interface{}) (float64, float64) {

	likelihoodLimitsXmin := helpers.GetElementByIndex(likelihoodPlotData, 0, "x").(float64)
	likelihoodLimitsXmax := helpers.GetElementByIndex(likelihoodPlotData, 100, "x").(float64)

    if len(altpriorPlotData.([]interface{})) == 1 {
      return likelihoodLimitsXmin, likelihoodLimitsXmax
      }

	// find the limits of the alt prior
  altpriorLimitsXmin := helpers.GetElementByIndex(altpriorPlotData, 0, "x").(float64)
  altpriorLimitsXmax := helpers.GetElementByIndex(altpriorPlotData, 100, "x").(float64)





	var nullpriorLimitsXmin float64
	var nullpriorLimitsXmax float64
	if len(nullpriorPlotData.([]interface{})) == 1 {
		nullpriorLimitsXmin = altpriorLimitsXmin
		nullpriorLimitsXmax = altpriorLimitsXmax
	} else {
		nullpriorLimitsXmin = helpers.GetElementByIndex(nullpriorPlotData, 0, "x").(float64)
		nullpriorLimitsXmax = helpers.GetElementByIndex(nullpriorPlotData, 100, "x").(float64)
	}
  

  xmin, _ := helpers.MinMax([]float64{likelihoodLimitsXmin, altpriorLimitsXmin, nullpriorLimitsXmin})
  _, xmax := helpers.MinMax([]float64{likelihoodLimitsXmax, altpriorLimitsXmax, nullpriorLimitsXmax})

	_, lim := helpers.MinMax([]float64{math.Abs(xmin), math.Abs(xmax)})
	if xmin < 0 {
		xmin = lim * -1
	} else {
		xmin = lim * 1
	}

	if xmax < 0 {
		xmax = lim * -1
	} else {
		xmax = lim * 1
	}

	return xmin, xmax
}
