from codecs import open
import json
from collections import OrderedDict

def in_town(year):
    if year >= 1980:
        return 50
    if year >= 1958:
        return 60
    return "unlimited"

def out_town(year):
    if year > 1985:
        return 80
    if year > 1973:
        return 100
    return "unlimited"

def highway(year):
    if year >= 1985:
        return 120
    if year >= 1974:
        return 130
    if year >= 1973:
        return 100
    return "unlimited"


data = OrderedDict()

from years import year_from, year_to

for year in range(year_from, year_to+1):
    d = OrderedDict()
    d["in_town"] = in_town(year)
    d["out_town"] = out_town(year)
    d["highway"] = highway(year)
    data[year] = d

with open("../speed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)
