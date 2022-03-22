from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

def set_likelihood(value, driver):
    selector = driver.find_element(By.ID, "likelihood_select")
    selector.click()
    value_field = driver.find_element(By.ID, "likelihood_value")
    if value == "normal":
        value_field.send_keys(Keys.ENTER)
    elif value == "student_t":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "binomial":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "noncentral_t":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ARROW_DOWN,
                              Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "noncentral_d":
        value_field.send_keys(
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ENTER,
        )
    elif value == "noncentral_d2":
        value_field.send_keys(
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ENTER,
        )


def set_value(param, value, driver):
    param_select = driver.find_element(By.ID, param)
    param_select.send_keys(value)


def set_altprior(value, driver):
    selector = driver.find_element(By.ID, "altprior_select")
    selector.click()
    value_field = driver.find_element(By.ID, "altprior_value")
    if value == "normal":
        value_field.send_keys(Keys.ARROW_DOWN,Keys.ENTER)
    elif value == "student_t":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "beta":
        value_field.send_keys(Keys.ARROW_DOWN,Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "cauchy":
        value_field.send_keys(Keys.ARROW_DOWN,Keys.ARROW_DOWN, Keys.ARROW_DOWN,
                              Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "uniform":
        value_field.send_keys(
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ENTER,
        )


def set_nullprior(value, driver):
    selector = driver.find_element(By.ID, "nullprior_select")
    selector.click()
    value_field = driver.find_element(By.ID, "nullprior_value")
    if value == "point":
        value_field.send_keys(Keys.ENTER)
    elif value == "normal":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "student_t":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "beta":
        value_field.send_keys(Keys.ARROW_DOWN, Keys.ARROW_DOWN,
                              Keys.ARROW_DOWN, Keys.ENTER)
    elif value == "cauchy":
        value_field.send_keys(
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ENTER,
        )
    elif value == "uniform":
        value_field.send_keys(
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ARROW_DOWN,
            Keys.ENTER,
        )


def calculate(driver):
    button = driver.find_element(By.ID, "calc_button")
    button.click()
    time.sleep(1)
    result = driver.find_element(By.ID,"result")
    return float(result.get_property("innerText"))
