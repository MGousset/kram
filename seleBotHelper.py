from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def getDriver():
    # Define options
    options = Options()
    #options.add_argument('--headless')
    options.add_argument('--start-maximized')
    options.add_argument('--inconito')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--log-level=3')
    
    # Contruct driver and add waiting options
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)

    return driver

def waitAndClick(driver, button):
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable(button))
    button.click()

def waitElementsToBeLoaded(driver, selectors):
    try :
        for selector in selectors:
            #print(selector)
            WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located(selector))

        for selector in selectors:
            WebDriverWait(driver, 10).until(EC.visibility_of_any_elements_located(selector))
    except:
        return False
    return True