import pandas as pd
from seleBotHelper import *
from pathlib import Path

MEDIA_CONTAINER = "div[@class='flex shrink-0 flex-wrap justify-center gap-4']"
ACTUAL_EVENTS_CONTAINER = "div[@class='gap grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8']"
DATE_CONTAINER = "div[@class='flex shrink-0 items-center gap-x-3 leading-tight']/div" 
OLD_EVENTS_CONTAINER = "div[@class='gap grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 gap-y-4 opacity-60 sm:gap-y-8']"

COOKIE_BUTTON_ID = "CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"

PLACE_SELECTOR = "a[class='flex-1 py-4 text-foreground']"
ARTISTE_SELECTOR = "div[class='text-muted-foreground mx-0.5 mb-3 line-clamp-1 text-sm']"
STYLE_SELECTOR = "a[class='text-sm tracking-wider h-11 rounded-full px-5 focus-visible:outline-hidden inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-bold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 text-primary border-border hover:border-primary/20 focus:border-primary/20 border bg-transparent']"
   
def getEventInfo(driver, link, first=False):
    #print(link)
    driver.get(link)

    cookieBtns = driver.find_elements(By.ID, COOKIE_BUTTON_ID)
    if len(cookieBtns) and first:
        waitAndClick(driver, cookieBtns[0])
    
    place = ""
    artistes = []
    styles = []
        
    # Get Place
    if waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, PLACE_SELECTOR)]):
        place = driver.find_elements(By.CSS_SELECTOR, PLACE_SELECTOR)[1].text
    
    # Get medias
    if waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, ARTISTE_SELECTOR)]):
        artisteElements = driver.find_elements(By.CSS_SELECTOR, ARTISTE_SELECTOR)
        for artiste in artisteElements:
            artistes.append(artiste.text)
        #print(medias)
    
    # Get styles
    if waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, STYLE_SELECTOR)]):
        styleElements = driver.find_elements(By.CSS_SELECTOR, STYLE_SELECTOR)
        for style in styleElements:
            styles.append(style.text)
        styles = list(dict.fromkeys(styles))
        #print(styles)
    
    return {"place": place, "artistes": artistes, "styles": styles}

def initFilledEventsFile(eventsFilename):
    filledEvents = pd.read_excel(eventsFilename.replace("filled", ""))
    filledEvents = filledEvents.drop(axis=1, columns=filledEvents.columns[0]).assign(place="", artistes="", styles="")
    filledEvents.to_excel(eventsFilename)

# Get driver
driver = getDriver()

for i in range(8, 11):
    eventsFilename = "filledShotgunEvents_{}.xlsx".format(i)
    if not Path(eventsFilename).exists():
        initFilledEventsFile(eventsFilename)
    
    # Open existing File
    filledEvents = pd.read_excel(eventsFilename)

    # Remove first columns
    filledEvents = filledEvents.drop(axis=1, columns=filledEvents.columns[0]).astype(str)
    first = True
    for index, row in filledEvents.iterrows():
        if not pd.isna(row['place']) and row['place'] != "" and row['place'] != "nan":
            continue
        
        link = row['link']
        infos = getEventInfo(driver, link, first=first)
        
        filledEvents.loc[index, "place"] = infos.get("place")
        filledEvents.loc[index, "artistes"] =", ".join(infos.get("artistes"))
        filledEvents.loc[index, "styles"] = ", ".join(infos.get("styles"))
        
        # Write into files
        filledEvents.to_excel(eventsFilename)
        first = False
        
        if index % 10 == 0:
            filledEvents.to_excel(eventsFilename.replace(".xlsx", ".save.xlsx"))

driver.quit()