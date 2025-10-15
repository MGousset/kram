def get_mixs():
    import time, re
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.common.by import By

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--start-maximized')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--log-level=3')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    driver.implicitly_wait(20)

    driver.get("https://soundcloud.com/krambzh/tracks")
    driver.find_element(By.ID, "onetrust-accept-btn-handler").click()
    share_buttons = driver.find_elements(By.CSS_SELECTOR, "button[class='sc-button-share sc-button-secondary sc-button-secondary sc-button sc-button-small sc-button-responsive']")[:5]

    mixs=[]
    for share_button in share_buttons:
        share_button.click()
        driver.find_element(By.CSS_SELECTOR, "a[class='tabs__tab g-tabs-link']").click()
        time.sleep(10)

        input = driver.find_element(By.CSS_SELECTOR, "input[class='widgetCustomization__textInput widgetCustomization__widgetCode']")
        text = input.get_attribute("value")
        track_id = re.search("tracks/[0-9]+&", text).group()[7:-1]
        mixs.append(track_id)

        driver.find_element(By.CLASS_NAME, "modal__closeButton").click()

    driver.quit()
    return mixs

def update_bdd(mixs):
    from update_events import config
    from main.models import Track
    
    config()
    Track.objects.all().delete()
    for mix in mixs:
        new_mix = Track(track_id=mix)
        new_mix.save()

mixs = get_mixs()
update_bdd(mixs)