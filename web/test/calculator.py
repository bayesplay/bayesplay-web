from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from utils import set_value, set_altprior, set_likelihood, set_nullprior
import time


class Calculator:
    def __init__(self, url, bin, headless):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-gpu")
        if headless:
            chrome_options.add_argument("--headless")
        s = Service(bin)
        # driver = webdriver.Chrome(service=s)
        self.driver = webdriver.Chrome(service = s, options=chrome_options)
        self.driver.get(url)

    def setmodel(self, model):
        self.driver.refresh()
        time.sleep(5)
        # do the likelihood
        likelihood = model["likelihood"]
        set_likelihood(likelihood["family"], self.driver)
        parameters = likelihood["parameters"]
        oldkeys = list(parameters.keys())
        newkeys = [x + "_d" for x in oldkeys]
        for o, n in zip(oldkeys, newkeys):
            parameters[n] = parameters.pop(o)
        for param in parameters.items():
            set_value(param[0], str(param[1]), self.driver)
        time.sleep(1)
        # do the alt prior
        alt_prior = model["alt_prior"]
        set_altprior(alt_prior["family"], self.driver)
        parameters = alt_prior["parameters"]
        oldkeys = list(parameters.keys())
        newkeys = [x + "_alt" for x in oldkeys]
        for o, n in zip(oldkeys, newkeys):
            parameters[n] = parameters.pop(o)

        # setting the range parameters (if needed)
        has_range = any("range_alt" in s for s in list(parameters.keys()))
        if has_range:
            range_param = parameters.pop("range_alt")
            if range_param[0] != "Inf":
                # then set the lower limit range params
                set_value("ll_alt", Keys.SPACE, self.driver)
                set_value("lower_alt", str(range_param[0]), self.driver)
            if range_param[1] != "Inf":
                # then set the lower limit range params
                set_value("ul_alt", Keys.SPACE, self.driver)
                set_value("upper_alt", str(range_param[1]), self.driver)
        for param in parameters.items():
            set_value(param[0], str(param[1]), self.driver)

        time.sleep(1)

        null_prior = model["null_prior"]
        set_nullprior(null_prior["family"], self.driver)
        parameters = null_prior["parameters"]
        oldkeys = list(parameters.keys())
        newkeys = [x + "_null" for x in oldkeys]
        for o, n in zip(oldkeys, newkeys):
            parameters[n] = parameters.pop(o)

        has_range = any("range_null" in s for s in list(parameters.keys()))
        if has_range:
            range_param = parameters.pop("range_null")
            if range_param[0] != "Inf":

                # then set the lower limit range params
                set_value("ll_null", Keys.SPACE, self.driver)
                set_value("lower_null", str(range_param[0]), self.driver)
            if range_param[1] != "Inf":

                # then set the lower limit range params
                set_value("ul_null", Keys.SPACE, self.driver)
                set_value("upper_null", str(range_param[1]), self.driver)
        for param in parameters.items():
            set_value(param[0], str(param[1]), self.driver)
            # do the null prior

        time.sleep(1)
        return self

    def calculate(self):
        button = self.driver.find_element(By.ID, "calc_button")
        button.click()
        time.sleep(1)
        result = self.driver.find_element(By.ID, "result")
        self.bf = float(result.get_property("innerText"))
        return self

    def writeRcode(self, fname):
        set_value("show_code", Keys.SPACE, self.driver)
        rcode = self.driver.find_element_by_class_name("myclass").get_property(
            "innerText"
        )
        # Now add code to test it in R
        rcode = (
            rcode
            + f'testthat::expect_equal(unclass(bf), unclass({self.bf}), tolerance = 0.001, scale = 1, label = "{fname}")'
        )

        # write out the test
        fname = f"test_{fname}.R"
        with open(fname, "wt") as f:
            f.writelines(rcode)
