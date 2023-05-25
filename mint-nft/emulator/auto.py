import time
import random
import requests
class solarPanel:
    def init(self):
        self.remainingKwh=str(random.randint(1,4)+random.randint(1,100)/100)
        self.postalCode=str(random.randint(100000,999999))
        self.dollarsPerKwh=str(27+random.randint(10,300)/100)

    def str(self):
        return "Remaining Kwh: "+str(self.remainingKwh)+" Postal Code: "+str(self.postalCode)+" Dollar Price: "+str(self.dollarsPerKwh)

def mintSolarPanel ():
    solarPanel1=solarPanel()
    location = solarPanel1.postalCode
    price=solarPanel1.dollarsPerKwh
    kwh=solarPanel1.remainingKwh
    URL = f"http://localhost:5000/mint?location={location}&price={price}&kwh={kwh}"
    r = requests.get(url = URL)

def mintFactory(n):
    for i in range (0,n):
        mintSolarPanel()
        if (i!=(n-1)):
            time.sleep(60)

mintFactory(3)