from codecs import open
import json
from collections import OrderedDict
import os

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

def alcohol(year):
    if year > 2005:
        return 0.5
    return 0.8

data = []

from years import year_from, year_to

last = {
    "in_town": None,
    "out_town": None,
    "highway": None,
    "alcohol": None,
}

values = (
    ("in_town", in_town),
    ("out_town", out_town),
    ("highway", highway),
    ("alcohol", alcohol),
)

for year in range(year_from, year_to+1):
    v_in_down = in_town(year)
    v_out_town = out_town(year)
    v_highway = highway(year)
    v_alcohol = alcohol(year)
    same = True
    if v_in_down != last["in_town"]:
        same = False
    if v_out_town != last["out_town"]:
        same = False
    if v_highway != last["highway"]:
        same = False
    if v_alcohol != last["alcohol"]:
        same = False

    if not same:
        last = {
            "year_from": year,
            "in_town": v_in_down,
            "out_town": v_out_town,
            "highway": v_highway,
            "alcohol": v_alcohol,
        }
        data.append(last)
    last["year_to"] = year

with open("../speed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=True)
