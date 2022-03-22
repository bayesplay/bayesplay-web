package helpers

import (
	"math"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func compareFloat(t *testing.T, got, want float64, msg string) {

	const tolerance = .001
	opt := cmp.Comparer(func(x, y float64) bool {
		diff := math.Abs(x - y)
		mean := math.Abs(x+y) / 2.0
		if math.IsNaN(diff / mean) {
			return true
		}
		return (diff / mean) < tolerance
	})

	if !cmp.Equal(got, want, opt) {
		t.Fatalf("TEST %s : got %v, wanted %v", msg, got, want)
	}
}

func TestSequence(t *testing.T) {

	seqLen := len(Seq(0,1))
	if !cmp.Equal(seqLen, 101) {
		t.Fatalf("TEST %s : got %v, wanted %v", "sequence length", seqLen, 101)
	}

	seqLen = len(Seq(-1,1))
	if !cmp.Equal(seqLen, 101) {
		t.Fatalf("TEST %s : got %v, wanted %v", "sequence length", seqLen, 101)
	}


	sequence := Seq(0, 1)
	compareFloat(t, sequence[0], 0, "first element of sequence")
	compareFloat(t, sequence[100], 1, "last element of sequence")


}

func TestMinMax(t *testing.T) {

	min, max := MinMax([]float64{0, 1, -1, 4})


	if !cmp.Equal(min, -1.0) {
		t.Fatalf("TEST %s : got %v, wanted %v", "MinMax", min, -1)
	}

	if !cmp.Equal(max, 4.0) {
		t.Fatalf("TEST %s : got %v, wanted %v", "MinMax", max, 4)
	}
}

func TestGetElementByIndex(t *testing.T) {

	element0 := map[string]interface{}{"a": 0.0, "b": 0.0}
	element1 := map[string]interface{}{"a": 1.0, "b": 1.0}

	elementArray := []interface{}{}
	elementArray = append(elementArray, element0)
	elementArray = append(elementArray, element1)

	item := GetElementByIndex(elementArray, 0, "a")

	compareFloat(t, item.(float64), 0.0, "GetElementByIndex")
	compareFloat(t, item.(float64), 0.0, "GetElementByIndex")

}
