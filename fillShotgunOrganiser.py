import pandas as pd
from pathlib import Path
from seleBotHelper import *
from datetime import datetime

TIMESTAMP_FORMAT = "%Y-%m-%d"
TIME_LIMIT = 1717192800 #01 06 2024

EVENTS_FILENAME = 'shotgunEvents_0.xlsx'

MEDIA_CONTAINER = "div[@class='flex shrink-0 flex-wrap justify-center gap-4']"
ACTUAL_EVENTS_CONTAINER = "div[@class='gap grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8']"
DATE_CONTAINER = "div[@class='flex shrink-0 items-center gap-x-3 leading-tight']/div" 
OLD_EVENTS_CONTAINER = "div[@class='gap grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 gap-y-4 opacity-60 sm:gap-y-8']"

COOKIE_BUTTON_ID = "CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
PRIVACY_BUTTON_SELECTOR = "button[class='gigz-gdpr-refuse']"

OLD_EVENTS_TITLE_SELECTOR = "h2[data-slot='heading'][class='font-title font-black uppercase text-xl md:text-2xl']"
CITY_SELECTOR = "div[class='text-muted-foreground capitalize']"
MEDIA_SELECTOR = "//{}/a[@class='text-sm tracking-wider size-9 shrink-0 rounded-full focus-visible:outline-hidden inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-bold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary/10 text-foreground hover:bg-primary/20 focus:bg-primary/20']".format(MEDIA_CONTAINER)
STYLE_SELECTOR = "div[class='inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 font-medium uppercase tracking-wider text-muted-foreground border-border text-2xs h-6']"
DATE_SELECTOR = "//{}/time[@datetime][1]".format(DATE_CONTAINER)

OLD_NAME_SELECTOR = "//p[@class='line-clamp-2 font-bold text-sm sm:text-lg']"
OLD_LINK_SELECTOR = "//{}/a[@data-slot='tracked-link']".format( OLD_EVENTS_CONTAINER)

SHOW_MORE_BUTTON_SELECTOR = "button[class='text-sm tracking-wider h-10 rounded-sm px-4 py-2 focus-visible:outline-hidden inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-bold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50 bg-primary/10 text-foreground hover:bg-primary/20 focus:bg-primary/20']"
    
def doesEventsExists(driver):
    titles = driver.find_elements(By.CSS_SELECTOR, OLD_EVENTS_TITLE_SELECTOR)
    waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, OLD_EVENTS_TITLE_SELECTOR)])
    
    # No events at all
    if len(titles) == 0:
        return (False, False)

    incomingEvents = False
    previousEvents = False
    
    for title in titles:
        if title.text == "ÉVÈNEMENTS À VENIR":
            incomingEvents = True
            
        elif title.text == "ÉVÈNEMENTS PASSÉS":
            previousEvents = True
            
    return (incomingEvents, previousEvents)
    

def isLimitReached(driver):
    dates = driver.find_elements(By.XPATH, DATE_SELECTOR)
    if len(dates) == 0: 
        return True
    
    lastDateStr = dates[-1].get_attribute('datetime')
    if lastDateStr == "": 
        return True
    
    lastDateStr = lastDateStr[:lastDateStr.find('T')]
    lastDate = datetime.strptime(lastDateStr, TIMESTAMP_FORMAT)
    #print(lastDate)
    if lastDate.timestamp() < TIME_LIMIT:
        return True

    return False

def showEvents(driver):
    while True:
        showMoreButtons = driver.find_elements(By.CSS_SELECTOR, SHOW_MORE_BUTTON_SELECTOR)
        if len(showMoreButtons) == 0: 
            break
        showMoreButton = showMoreButtons[0]
        
        if not waitElementsToBeLoaded(driver, [(By.XPATH, DATE_SELECTOR), (By.CSS_SELECTOR, SHOW_MORE_BUTTON_SELECTOR)]):
            break
        
        try:
            WebDriverWait(driver, 10).until(EC.element_to_be_clickable(showMoreButton))
        except:
            break
        
        if (isLimitReached(driver)):
            break
        
        showMoreButton.click()
    return

def getEventFromVenue(driver, link, first=False):
    #print(link)
    driver.get(link)

    cookieBtns = driver.find_elements(By.ID, COOKIE_BUTTON_ID)
    if len(cookieBtns) and first:
        waitAndClick(driver, cookieBtns[0])
        
        privaciesBtn = driver.find_elements(By.CSS_SELECTOR, PRIVACY_BUTTON_SELECTOR)
        if len(privaciesBtn):
            waitAndClick(driver, privaciesBtn[0])
    
    city = ""
    medias = []
    styles = []
    events = []
    
    (incomingEvents, previousEvents) = doesEventsExists(driver)
    if not incomingEvents and not previousEvents:
        return {"city": city, "medias": medias, "styles": styles, "events": events}
    
    NAME_SELECTOR = "//p[@class='line-clamp-2 text-lg font-bold leading-tight']" 
    LINK_SELECTOR = "//{}/a[@data-slot='tracked-link']".format(ACTUAL_EVENTS_CONTAINER)

    if previousEvents:
        NAME_SELECTOR = NAME_SELECTOR + " | " + OLD_NAME_SELECTOR
        LINK_SELECTOR = LINK_SELECTOR + " | " + OLD_LINK_SELECTOR

    if previousEvents:
        showEvents(driver)
        
    # Get city
    if waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, CITY_SELECTOR)]):
        city = driver.find_element(By.CSS_SELECTOR, CITY_SELECTOR).text
        #print(city)
    
    # Get medias
    if waitElementsToBeLoaded(driver, [(By.XPATH, MEDIA_SELECTOR)]):
        mediaElements = driver.find_elements(By.XPATH, MEDIA_SELECTOR)
        for media in mediaElements:
            medias.append({media.get_attribute('title'): media.get_attribute('href')})
        #print(medias)
    
    # Get styles
    if waitElementsToBeLoaded(driver, [(By.CSS_SELECTOR, STYLE_SELECTOR)]):
        styleElements = driver.find_elements(By.CSS_SELECTOR, STYLE_SELECTOR)
        for style in styleElements:
            styles.append(style.text)
        styles = list(dict.fromkeys(styles))
        #print(styles)
    
    # Get events
    if waitElementsToBeLoaded(driver, [(By.XPATH, NAME_SELECTOR), (By.XPATH, LINK_SELECTOR), (By.XPATH, DATE_SELECTOR)]):
        names = driver.find_elements(By.XPATH, NAME_SELECTOR)
        links = driver.find_elements(By.XPATH, LINK_SELECTOR)
        dates = driver.find_elements(By.XPATH, DATE_SELECTOR)
        
        #print(len(names), len(links), len(dates))
        for name, link, dateElement in zip(names, links, dates):
            date = dateElement.get_attribute('datetime')
            if date: 
                date = date[:date.find('T')]
            else: 
                date = ""
            events.append({"name": name.text, "link": link.get_attribute('href'), "date": date})
        #print(events)
    return {"city": city, "medias": medias, "styles": styles, "events": events}

def initFiles():
    initFilledOrgasFile()
    initEventsFile()
    
def initFilledOrgasFile():
    filledOrgas = pd.read_excel('shotgunVenues.xlsx')
    filledOrgas = filledOrgas.drop(axis=1, columns=filledOrgas.columns[0]).assign(city="", medias="", styles="")
    filledOrgas.to_excel('filledShotgunVenues.xlsx')
    
    all_events = pd.DataFrame(columns=["venueId", "name", "link", "date"])
    all_events.to_excel(EVENTS_FILENAME)
    
def initEventsFile():
    all_events = pd.DataFrame(columns=["venueId", "name", "link", "date"])
    all_events.to_excel(EVENTS_FILENAME)
    

#! ONCE
fileIndex=0
#initEventsFile()

# Get driver
driver = getDriver()

# Open existing File
filledOrgas = pd.read_excel('filledShotgunVenues.xlsx')
all_events = pd.read_excel(EVENTS_FILENAME)

# Remove first columns
filledOrgas = filledOrgas.drop(axis=1, columns=filledOrgas.columns[0]).astype(str)
all_events = all_events.drop(axis=1, columns=all_events.columns[0]).astype(str)

first = True
for index, row in filledOrgas.iterrows():
    if not pd.isna(row['city']) and row['city'] != "" and row['city'] != "nan":
        continue
    
    if fileIndex != index//100:
        newFileIndex = index//100
        EVENTS_FILENAME = EVENTS_FILENAME.replace(str(fileIndex), str(newFileIndex))
        fileIndex = newFileIndex
        if not Path(EVENTS_FILENAME).exists():
            initEventsFile()
        all_events = pd.read_excel(EVENTS_FILENAME)
        
    link = row['link']
    infos = getEventFromVenue(driver, link, first=first)
    events = infos.get("events")
    
    filledOrgas.loc[index, "city"] = infos.get("city")
    filledOrgas.loc[index, "medias"] = ", ".join([str(d) for d in infos.get("medias")])
    filledOrgas.loc[index, "styles"] = ", ".join(infos.get("styles"))
    
    for event in events:
        event["venueId"] = index
    
    all_events = pd.concat([all_events, pd.DataFrame.from_dict(events)])
    
    # Write into files    
    filledOrgas.to_excel('filledShotgunVenues.xlsx')
    all_events.to_excel(EVENTS_FILENAME)
    
    first = False
    #break

driver.quit()