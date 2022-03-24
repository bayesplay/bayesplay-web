package bayesfactor

import (
	"math"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func compare(t *testing.T, got, want float64) {
	// const tolerance = .0001
	const tolerance = .001
	opt := cmp.Comparer(func(x, y float64) bool {
		diff := math.Abs(x - y)
		mean := math.Abs(x+y) / 2.0
		return (diff / mean) < tolerance
	})

	if !cmp.Equal(got, want, opt) {
		t.Fatalf("got %v, wanted %v", got, want)
	}
}

func TestBayesfactor(t *testing.T) {

	var likelihood LikelihoodDefinition // likelihood
	var altprior PriorDefinition        // alternative prior
	var nullprior PriorDefinition       // null prior
	//// likelihood
	likelihood.Name = "noncentral_d"
	likelihood.Params = []float64{2.03 / math.Sqrt(80), 80}
	//// alt prior
	altprior.Name = "cauchy"
	altprior.Params = []float64{0, 1, math.Inf(-1), math.Inf(1)}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.0}
	bf, _ := Bayesfactor(likelihood, altprior, nullprior)
	got := bf
	want := 1 / 1.557447
	compare(t, got, want)

	likelihood.Name = "noncentral_t"
	likelihood.Params = []float64{2.03, 79.0}
	//// alt prior
	altprior.Name = "cauchy"
	altprior.Params = []float64{0, 1 * math.Sqrt(80), math.Inf(-1), math.Inf(1)}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.0}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 1 / 1.557447
	compare(t, got, want)

	likelihood.Name = "normal"
	likelihood.Params = []float64{5.5, 32.35}
	//// alt prior
	altprior.Name = "normal"
	altprior.Params = []float64{0, 13.3, 0, math.Inf(1)}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.0}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 0.9745934
	compare(t, got, want)

	likelihood.Name = "normal"
	likelihood.Params = []float64{5, 10}
	//// alt prior
	altprior.Name = "uniform"
	altprior.Params = []float64{0, 20.0}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.0}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 0.8871298
	compare(t, got, want)

	likelihood.Name = "binomial"
	likelihood.Params = []float64{8, 11}
	//// alt prior
	altprior.Name = "beta"
	altprior.Params = []float64{2.5, 1}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.5}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 1 / 0.6632996
	compare(t, got, want)

	likelihood.Name = "binomial"
	likelihood.Params = []float64{2, 10}
	//// alt prior
	altprior.Name = "normal"
	altprior.Params = []float64{0, 1, 0, 1}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0.5}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 2.327971
	// compare(t, got, want)

	likelihood.Name = "student_t"
	likelihood.Params = []float64{5.47, 32.2, 119}
	//// alt prior
	altprior.Name = "student_t"
	altprior.Params = []float64{13.3, 4.93, 72, math.Inf(-1), math.Inf(1)}
	//// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 0.9738
	compare(t, got, want)

	likelihood.Name = "noncentral_d2"
	likelihood.Params = []float64{-0.644110547740848, 15, 16}
	// alt prior
	altprior.Name = "cauchy"
	altprior.Params = []float64{0, 1, math.Inf(-1), math.Inf(1)}
	// null prior
	nullprior.Name = "point"
	nullprior.Params = []float64{0}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = bf
	want = 0.9709
	compare(t, got, want)

	// set the parameters
	m1 := 13.6
	s1 := 9.8
	var1 := math.Pow(s1, 2)
	n1 := 32.0

	m2 := 17.1
	s2 := 8.0
	var2 := math.Pow(s2, 2)
	n2 := 33.0

	dpost := 2 / math.Sqrt(((n1-1.0)*var1+(n2-1.0)*var2)/(n1+n2-2))
	compare(t, dpost, 0.2239349) // check d is correct

	// next work out the effect size
	sd_pooled := math.Sqrt(((n1-1.0)*var1 + (n2-1.0)*var2) / (n1 + n2 - 2.0))
	d := (m1 - m2 - 2) / sd_pooled
	compare(t, d, -0.615821093011047)

	likelihood.Name = "noncentral_d2"
	likelihood.Params = []float64{d, n1, n2}

	// alt prior
	altprior.Name = "cauchy"
	altprior.Params = []float64{dpost, 1 / math.Sqrt(2), 0, math.Inf(1)}
	// null prior
	nullprior.Name = "cauchy"
	nullprior.Params = []float64{dpost, 1 / math.Sqrt(2), math.Inf(-1), 0}
	val := Pp(likelihood, altprior).Auc
	compare(t, val, 0.001322392)

	val = Pp(likelihood, nullprior).Auc
	compare(t, val, 0.1196969)

	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	got = 1 / bf
	want = 90.51545
	compare(t, got, want)
	se := 11 / 1.966
	m1 = 63.6
	// n1 = 203
	n1 = 203
	m2 = 68.1
	// n2 = 201
	n2 = 201

	t_value := (m1 - m2) / se
	d = t_value * math.Sqrt(1/n1+1/n2)
	compare(t, d, -0.08002911)
	likelihood.Name = "noncentral_d2"
	likelihood.Params = []float64{d, n1, n2}
	// likelihood.Name = "normal"
	// likelihood.Params = []float64{d, n1 / n2}

	altprior.Name = "cauchy"
	altprior.Params = []float64{0, 1 / math.Sqrt(2), math.Inf(-1), 0}

	val = Pp(likelihood, altprior).Auc
	compare(t, val, 0.06817809)

	///
	nullprior.Name = "point"
	nullprior.Params = []float64{0.0}
	val = Pp(likelihood, nullprior).Auc
	// override tolerance for this test
	const tolerance = .01
	opt := cmp.Comparer(func(x, y float64) bool {
		diff := math.Abs(x - y)
		mean := math.Abs(x+y) / 2.0
		return (diff / mean) < tolerance
	})

	want = 0.288364
	if !cmp.Equal(val, want, opt) {
		t.Fatalf("got %v, wanted %v (tolerance override)", val, want)
	}
	///

	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	compare(t, bf, 0.2364307)

	// test with extreme values of for noncentral t distributions
	// bayesplay-go and the BayesFactor R package start to diverage
	// at effect sizes above about ~4.564355
	// this is because R uses an approximation of the noncentral t
	// for large values of t... this is currently not implemented
	// in bayesplay-go
	// 	likelihood.Name = "noncentral_d"
	// 	likelihood.Params = []float64{25.0 / math.Sqrt(30), 30}
	// 	altprior.Name = "cauchy"
	// 	altprior.Params = []float64{0, 1, math.Inf(-1), math.Inf(1)}
	//
	// 	nullprior.Name = "point"
	// 	nullprior.Params = []float64{0}
	// 	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	// 	got = bf
	// 	want = 1.37081e+18
	// 	compare(t, got, want)

	// Gronau, Ly, & Wagenmakers (2020). Informed Bayesian *t*-Tests

	likelihood.Name = "noncentral_d2"

	n1 = 53
	m1 = 4.63
	s1 = 1.48

	n2 = 57
	m2 = 4.87
	s2 = 1.32
	v1 := s1 * s1
	v2 := s2 * s2

	md_diff := m1 - m2
	sd_pooled = math.Sqrt((((n1 - 1) * v1) + ((n2 - 1) * v2)) / (n1 + n2 - 2))
	d = md_diff / sd_pooled
	likelihood.Name = "noncentral_d2"
	likelihood.Params = []float64{d, n1, n2}

	altprior.Name = "cauchy"
	altprior.Params = []float64{0, 1 / math.Sqrt(2), 0, math.Inf(1)}

	nullprior.Name = "point"
	nullprior.Params = []float64{0.0}

	bf, _ = Bayesfactor(likelihood, altprior, nullprior)
	compare(t, 1/bf, 8.682698) // default t-test

	// informed t-test

	// h1 <- prior("student_t", 0.350, 0.103, 3, c(0, Inf))
	altprior.Name = "student_t"
	altprior.Params = []float64{0.350, 0.102, 3.0, 0.0, math.Inf(1)}
	bf, _ = Bayesfactor(likelihood, altprior, nullprior)

	val = Pp(likelihood, altprior).Auc
  target_value1 := 0.02298402
	compare(t, val,  target_value1)

  val = Pp(likelihood, nullprior).Auc

  target_value2 := 0.265162
  compare(t, val, target_value2)
  
  compare(t, 1 / bf, 11.5368) // informed t-test



  likelihoodFunction := CreateLikelihood(likelihood).Function
  prior := CreatePrior(altprior)
  prod := mult(likelihoodFunction, prior.Function)
  val = prod(0)
  target := 0.09834642	
  // compare(t, val, target)

  val = prior.Function(0)
  target = 0.1517234
  compare(t, val, target)
  
  val = prior.Function(1)
  target =  0.01741436
  compare(t, val, target)


}

