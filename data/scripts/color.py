from codecs import open
import json
import os
from collections import OrderedDict


colors = OrderedDict()
colors["dead"] = "#000"
colors["seriously_injured"] = "#FF0000"
colors["lightly_injured"] = "#FFB300"

with open("../colors.json", "w", encoding="utf-8") as f:
    json.dump(colors, f, indent=True)

with open("../../css/colors.less", "w", encoding="utf-8") as f:
    for c in colors:
        f.write("@color_%s: %s;%s" % (c, colors[c], os.linesep))
