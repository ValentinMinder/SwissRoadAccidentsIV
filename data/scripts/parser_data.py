#!/bin/python3
# coding: utf-8
import csv
from itertools import takewhile, dropwhile
from copy import deepcopy
import json

def safe_int(s):
    try:
        return int(s)
    except ValueError:
        return -1

# read file to write abbreviation instead of canton name
with open('../helpers/cantons-name.json', encoding="utf-8") as cantons_abbr_file:
    # globals stats
    max_canton_dead_victims = -1
    max_canton_seriously_victims = -1
    max_canton_lightly_victims = -1

    json_canton_abbr = json.load(cantons_abbr_file)

    def get_canton_abbr(canton_name):
        for abbr_key, abbr_value in json_canton_abbr.items():
            if abbr_value["fr"] == canton_name:
                return abbr_key
        return "INVALID_CANTON_NAME (%s)" % canton_name


    def update_global_stats(deads, seriously_inj, lightly_inj):
        global max_canton_dead_victims
        global max_canton_seriously_victims
        global max_canton_lightly_victims

        max_canton_dead_victims = max(max_canton_dead_victims, deads)
        max_canton_seriously_victims = max(max_canton_seriously_victims, seriously_inj)
        max_canton_lightly_victims = max(max_canton_lightly_victims, lightly_inj)

    with open('../data.csv', newline='', encoding="utf-8") as csvfile:
        # json labels
        json_canton_label = "cantons"
        json_year_label = "year"

        json_data = dict()
        json_data[json_year_label] = dict()
        reader = csv.reader(csvfile, delimiter=',')

        year = 2014 # starting year

        # region that do not have cantons
        isolated_regions = ["Tessin", "Zurich"]

        # get total for the first line
        # so ugly you don't touch it even with a stick !
        first = True
        line_year = None

        for line in reader:
            print("[year: %s]" % year)
            year_label = "_%s" % year
            json_data["year"][year_label] = dict()

            if first:
                line_year = deepcopy(line)
            # print("total year: %s -> %s" % (line_year[0], line_year[1]))

            # save data to json_data
            j_year_total = int(line_year[1])
            j_year_dead = int(line_year[2])
            j_year_seriously_inj = int(line_year[4])
            j_year_lightly_inj = int(line_year[5])

            json_data["year"][year_label]["total"] = j_year_total
            json_data["year"][year_label]["dead"] = j_year_dead
            json_data["year"][year_label]["seriously_injured"] = j_year_seriously_inj
            json_data["year"][year_label]["lightly_injured"] = j_year_lightly_inj

            line = next(reader)
            if first:
                line = next(reader)
                first = False
            print(line)

            # add region to json
            region_label = "regions"
            json_data["year"][year_label][region_label] = dict()

            while line[0] != "Total":
                # retrieve region until meet "Total".
                # At the end of the file break the loop to end it correctly
                # print(" "*3 + "region: " + line[0])

                region_name = line[0]
                json_data["year"][year_label][region_label][region_name] = dict()

                j_region_total = safe_int(line[1])
                j_region_dead = safe_int(line[2])
                j_region_seriously_inj = safe_int(line[4])
                j_region_lightly_inj = safe_int(line[5])

                json_data["year"][year_label][region_label][region_name]["total"] = j_region_total
                json_data["year"][year_label][region_label][region_name]["dead"] = j_region_dead
                json_data["year"][year_label][region_label][region_name]["seriously_injured"] = j_region_seriously_inj
                json_data["year"][year_label][region_label][region_name]["lightly_injured"] = j_region_lightly_inj

                json_data["year"][year_label][region_label][region_name][json_canton_label] = dict()

                # handle isolated regions
                if region_name in isolated_regions:
                    print("isolated: %s" % region_name)
                    canton_abbr = get_canton_abbr(region_name)
                    json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr] = dict()
                    json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["total"] = j_region_total
                    json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["dead"] = j_region_dead
                    json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["seriously_injured"] = j_region_seriously_inj
                    json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["lightly_injured"] = j_region_lightly_inj

                try:
                    line = next(reader)
                except StopIteration:
                    break


                while line[0] != "":
                    # print(" "*6 +"--Canton")
                    json_data["year"][year_label][region_label][region_name][json_canton_label] = dict()

                    while line[0] != "":
                        # print(" "*9 + "canton: " + line[0] + ": " + line[1])

                        # retrieve canton until meet empty line --> ,,,,,

                        canton_name = line[0]
                        canton_abbr = get_canton_abbr(canton_name)

                        j_canton_total = safe_int(line[1])
    #                     print("j_region: %s" % j_canton_total)
                        j_canton_dead = safe_int(line[2])
                        j_canton_seriously_inj = safe_int(line[4])
                        j_canton_lightly_inj = safe_int(line[5])

                        update_global_stats(j_canton_dead, j_canton_seriously_inj, j_canton_lightly_inj)

                        json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr] = dict()
                        json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["total"] = j_canton_total
                        json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["dead"] = j_canton_dead
                        json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["seriously_injured"] = j_canton_seriously_inj
                        json_data["year"][year_label][region_label][region_name][json_canton_label][canton_abbr]["lightly_injured"] = j_canton_lightly_inj


                        try:
                            line = next(reader)
                        except StopIteration:
                            pass

                    # print(" "*6 +"--end Canton")

                # print(" "*3 + "end region")
                line = next(reader)

            line_year = deepcopy(line)

            # print("[end year]")
            year -= 1


        # write global stats in json
        print("[stats] dead: %s, seriously %s, lightly %s" % (max_canton_dead_victims, max_canton_seriously_victims, max_canton_lightly_victims))
        json_data["stats"] = dict()
        json_data["stats"]["max_canton_dead_victims"] = max_canton_dead_victims
        json_data["stats"]["max_canton_seriously_victims"] = max_canton_seriously_victims
        json_data["stats"]["max_canton_lightly_victims"] = max_canton_lightly_victims

        # dump json
        with open('../data.json', 'w', encoding="utf-8") as fp:
            json.dump(json_data, fp, indent=2, ensure_ascii=False)
