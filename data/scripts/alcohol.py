from codecs import open
import json
from collections import OrderedDict

def alcohol(year):
    if year > 2005:
        return 0.5
    return 0.8

data = OrderedDict()

from years import year_from, year_to

for year in range(year_from, year_to+1):
    data[year] = {
        "alcohol": alcohol(year),
    }

with open("../alcohol.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)

