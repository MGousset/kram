import pandas as pd
from seleBotHelper import *

FIRST_PAGE_URL = "https://shotgun.live/fr/venues/-/france"

COOKIE_BUTTON_ID = "CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
NAV_BUTTON_SELECTOR = "a[class='text-sm tracking-wider size-9 shrink-0 rounded-full focus-visible:outline-hidden inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-bold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 text-primary border-border hover:border-primary/20 focus:border-primary/20 border bg-transparent']"
NAME_SELECTOR = "div[class='font-bold']"
LINK_SELECTOR = "a[data-slot='tracked-link'][class='bg-card flex items-center gap-4 rounded-sm p-6']"
    
def get_orgas(driver):    
    # Drive to first page and accept cookie
    driver.get(FIRST_PAGE_URL)
    cookieBtn = driver.find_element(By.ID, COOKIE_BUTTON_ID)
    waitAndClick(cookieBtn)
    
    # Fill infos with all page content
    infos=[]
    while True:
        waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, NAME_SELECTOR), (By.CSS_SELECTOR, LINK_SELECTOR), (By.CSS_SELECTOR, NAV_BUTTON_SELECTOR)])
        
        # Get final navigation button, retuns if not found
        navButtons = driver.find_elements(By.CSS_SELECTOR, NAV_BUTTON_SELECTOR)
        if len(navButtons) == 0: 
            print(nextBtn.get_attribute('href'))
            return infos
        nextBtn = navButtons[-1]
        
        # Fill infos with page content
        organisers = driver.find_elements(By.CSS_SELECTOR, NAME_SELECTOR)
        links = driver.find_elements(By.CSS_SELECTOR, LINK_SELECTOR)
        for orga, link in zip(organisers, links):
            infos.append({"name": orga.text, "link": link.get_attribute('href')})
        
        # If last page, last button is not empty
        if (len(nextBtn.text) != 0) : 
            break 
        
        # Else, navigate to the next page
        waitAndClick(nextBtn)
        
        # Wait page reaload before continue
        WebDriverWait(driver, 10).until(EC.staleness_of(nextBtn))
        continue
    return infos

driver = getDriver()
infos = get_orgas(driver)
driver.quit()

df = pd.DataFrame.from_dict(infos)
print(df)
df.to_excel('shotgunVenues.xlsx')