from codecs import open
import json
from collections import OrderedDict

data = OrderedDict()
with open("../population.csv", "r", encoding="utf-8") as f:
    cantons = next(f).strip().split(";")[1:]
    for l in f:
        p = l.strip().split(";")
        d = OrderedDict()
        year = p[0]
        p = p[1:]
        for c, e in zip(cantons, p):
            d[c] = int(e)
        data[year] = d

with open("../population.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)
