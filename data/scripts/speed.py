from codecs import open
import json
from collections import OrderedDict

def in_town(year):
    if year > 1983:
        return "50"
    return "unlimited"

def out_town(year):
    if year > 1988:
        return "80"
    return "unlimited"

def small_highway(year):
    if year > 1988:
        return "100"
    return "unlimited"

def highway(year):
    if year > 1988:
        return "120"
    return "unlimited"


data = OrderedDict()

for year in range(1970, 2016+1):
    data[year] = {
        "in_town": in_town(year),
        "out_town": out_town(year),
        "small_highway": small_highway(year),
        "highway": highway(year),
    }

with open("../speed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)

