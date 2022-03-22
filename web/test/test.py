# from calculator import Calculator
import json
import unittest
import os
# HOSTNAME = "http://172.18.0.2:3000"
# CHROME = "/usr/bin/chromedriver"


class TestCalculator(unittest.TestCase):
    def setUp(self):
        with open("./test/testcases.json", "rt") as f:
            self.testcases = json.loads(f.read())

        with open("./test/test_outcomes", "rt") as f:
            self.results = f.readlines()
        return self

    def test_half_normal(self):
        case = self.testcases[0]
        print(f'testing:\n\
likelihood: {self.testcases[0]["model"]["likelihood"]}\n\
alt prior: {self.testcases[0]["model"]["alt_prior"]}\n\
null prior: {self.testcases[0]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[0]
        self.assertAlmostEqual(result, float(outcome))

    def test_normal(self):
        case = self.testcases[1]
        print(f'testing:\n\
likelihood: {self.testcases[1]["model"]["likelihood"]}\n\
alt prior: {self.testcases[1]["model"]["alt_prior"]}\n\
null prior: {self.testcases[1]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[1]
        self.assertAlmostEqual(result, float(outcome))

    def test_noncentral_d(self):
        case = self.testcases[2]
        print(f'testing:\n\
likelihood: {self.testcases[1]["model"]["likelihood"]}\n\
alt prior: {self.testcases[1]["model"]["alt_prior"]}\n\
null prior: {self.testcases[1]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[2]
        self.assertAlmostEqual(result, float(outcome))

    def test_noncentral_t(self):
        case = self.testcases[3]
        print(f'testing:\n\
likelihood: {self.testcases[3]["model"]["likelihood"]}\n\
alt prior: {self.testcases[3]["model"]["alt_prior"]}\n\
null prior: {self.testcases[3]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[3]
        self.assertAlmostEqual(result, float(outcome))


    def test_noncentral_d2(self):
        case = self.testcases[4]
        print(f'testing:\n\
likelihood: {self.testcases[4]["model"]["likelihood"]}\n\
alt prior: {self.testcases[4]["model"]["alt_prior"]}\n\
null prior: {self.testcases[4]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[4]
        self.assertAlmostEqual(result, float(outcome))


    def test_binomial(self):
        case = self.testcases[5]
        print(f'testing:\n\
likelihood: {self.testcases[5]["model"]["likelihood"]}\n\
alt prior: {self.testcases[5]["model"]["alt_prior"]}\n\
null prior: {self.testcases[5]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[5]
        self.assertAlmostEqual(result, float(outcome))

    def test_normal_normal_uniform(self):
        case = self.testcases[6]
        print(f'testing:\n\
likelihood: {self.testcases[6]["model"]["likelihood"]}\n\
alt prior: {self.testcases[6]["model"]["alt_prior"]}\n\
null prior: {self.testcases[6]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[6]
        self.assertAlmostEqual(result, float(outcome))

    def test_student_t_normal_uniform(self):
        case = self.testcases[7]
        print(f'testing:\n\
likelihood: {self.testcases[7]["model"]["likelihood"]}\n\
alt prior: {self.testcases[7]["model"]["alt_prior"]}\n\
null prior: {self.testcases[7]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[7]
        self.assertAlmostEqual(result, float(outcome))

    def test_student_t_normal_normal(self):
        case = self.testcases[8]
        print(f'testing:\n\
likelihood: {self.testcases[8]["model"]["likelihood"]}\n\
alt prior: {self.testcases[8]["model"]["alt_prior"]}\n\
null prior: {self.testcases[8]["model"]["alt_prior"]}\n')
        result = case["bf"]
        outcome = self.results[8]
        self.assertAlmostEqual(result, float(outcome))



if __name__ == '__main__':
    unittest.main(warnings='ignore')
    os.remove("./tests/test_outcomes") 
