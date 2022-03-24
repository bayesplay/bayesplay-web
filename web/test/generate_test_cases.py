from calculator import Calculator
import json

# HOSTNAME = "http://172.19.0.2:3000"
HOSTNAME = "http:/10.5.0.5:3000"
HOSTNAME = "http://172.20.0.6:3000"
CHROME = "/usr/bin/chromedriver"


with open("./testcases.json", "rt") as f:
    testcases = json.loads(f.read())
    calculator = Calculator(HOSTNAME, CHROME, True)

outcomes = []
for i, case in enumerate(testcases):
    print(f"Generating case for model {i}...")
    model = case["model"]
    result = case["bf"]
    try:
        calculator.setmodel(model).calculate()
        outcomes.append(calculator.bf)
    except:
        outcomes.append(0)

with open("test_outcomes", "wt") as f:
    for outcome in outcomes:
        f.write(str(outcome) + "\n")
