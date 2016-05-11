from codecs import open
import json

year_from = 1975
year_to = 2014

with open("../years.json", "w", encoding="utf-8") as f:
    json.dump(tuple(range(year_from, year_to+1)), f, indent=True)