from codecs import open
import json
from collections import OrderedDict

def alcohol(year):
    if year > 2005:
        return "0.5"
    return "0.8"

data = OrderedDict()

for year in range(1970, 2016+1):
    data[year] = {
        "alcohol": alcohol(year),
    }

with open("../alcohol.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)

