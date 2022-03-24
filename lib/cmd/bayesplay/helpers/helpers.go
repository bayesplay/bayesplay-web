package helpers



func GetElementByIndex(x interface{}, i int, element string) interface{} {
	return x.([]interface{})[i].(map[string]interface{})[element]
	
}


func Seq(min float64, max float64) [101]float64 {
	step := (max - min) / (100)
	var values [101]float64
	t := min
	for i := 0; i < 101; i++ {
		values[i] = t
		t += step
	}
	values[100] = max

	return values
}


func MinMax(array []float64) (float64, float64) {
	max := array[0]
	min := array[0]
	// var min float64 = array[0]
	for _, value := range array {
		if max < value {
			max = value
		}
		if min > value {
			min = value
		}
	}
	return min, max
}


func SeqSteps(min float64, max float64, stepSize float64) []float64 {

	var values []float64
	i := 0
	for v := min; v < max; v += stepSize {
		values = append(values, v)
		i++
	}

	return values
}


func SeqShort(min float64, max float64) []float64 {
	step := (max - min) / (100)
	var values []float64
	t := min
	for i := min; i < max; i += step {
		values = append(values, t)
		t += step
	}
	values = append(values, max)

	return values
}


func inrange(x float64, min float64, max float64) float64 {
	if x >= min && x <= max {
		return 1
	}
	return 0
}
