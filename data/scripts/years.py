from codecs import open
import json
from collections import OrderedDict

year_from = 1975
year_to = 2014

with open("../settings.json", "w", encoding="utf-8") as f:
    data = OrderedDict()
    data["year_from"] = year_from
    data["year_to"] = year_to
    data["bigYears"] = [
        1975,
        1984,
        1989,
        2006,
        2014,
    ]
    json.dump(data, f, indent=True)