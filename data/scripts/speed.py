from codecs import open
import json

from collections import OrderedDict

data = OrderedDict()
with open("../speed.csv", "r", encoding="utf-8") as f:
    next(f)
    for l in f:
        p = l.strip().split(";")
        data[p[0]] = {
            "in_town": p[1],
            "out_town": p[2],
            "small_highway": p[3],
            "highway": p[4],
        }

with open("../speed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)