from codecs import open
import json

year_from = 1975
year_to = 2014

with open("../settings.json", "w", encoding="utf-8") as f:
    data = {
        "year_from": year_from,
        "year_to": year_to,
    }
    json.dump(data, f, indent=True)