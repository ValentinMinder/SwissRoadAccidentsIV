from codecs import open
import json
from collections import OrderedDict

data = {}

from years import year_from, year_to

with open("../vehicles.csv", "r", encoding="utf-8") as f:
    cantons = next(f).strip().split(";")[1:]
    for l in f:
        p = l.strip().split(";")
        d = OrderedDict()
        d["ALL"] = 0
        year = p[0]
        p = p[1:]
        for c, e in zip(cantons, p):
            d[c] = int(e)
        d["ALL"] = sum(d.values())
        data[year] = d

supp = {}

for year in range(year_from, year_to+1):
    year_str = str(year)
    if not str(year) in data:
        x1 = year
        while str(x1) not in data:
            x1 -= 1
        x2 = year
        while str(x2) not in data:
            x2 += 1
        d = OrderedDict()
        for k in data[str(x1)]:
            y1 = data[str(x1)][k]
            y2 = data[str(x2)][k]
            div = float(x2-x1)
            a = (y2-y1)/div
            b = (x2 * y1 - x1 * y2)/div
            d[k] = int(round(a * year + b, 0))
        supp[str(year)] = d

data.update(supp)
data = OrderedDict(sorted(data.items()))

with open("../vehicles.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)
