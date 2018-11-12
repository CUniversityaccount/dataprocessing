#!/usr/bin/env python
# Name: Coen Mol
# Student number: 12309524
"""This script goes through the input file"""

import pandas as pd
from bokeh.plotting import figure, output_file, show
import numpy as np
import sys
import csv

def loading(file, variables):
    variables = variables.split(', ')
    for word in range(len(variables)):
        variables[word] = variables[word].strip()

    new_file = []
    dict = {}
    with open(file) as document:
        import_file = csv.reader(document)
        text = csv.DictReader(document)
        for count, row in enumerate(text):
            for key, item in row.items():
                if key.strip() in variables and item != '':
                    if key == "GDP ($ per capita) dollars":
                        item = item.replace('dollars', '')
                        try:
                            dict.update({key: int(item.strip())})
                        except:
                            dict.update({key: None})
                    else:

                    # hierzo nog kijken of dit niet hoeft hardgecodeerd
                        if item != "unknown":
                            dict.update({key: item.strip()})
                        else:
                            dict.update({key: None})

            if dict != {}:
                new_file.append(dict)
                dict = {}
    return new_file

def parsing(file):
    data = file
    dataframe = pd.DataFrame(data)
    return dataframe

def calculations(file, selection):
    data = file
    list = data[selection]

    # calculates the mean, mode, median for the GDP
    mean = list.mean()
    median = list.median()
    mode = list.mode()
    print(list.describe())


    # calculates the standard deviation
    standard_deviation = list.std()

    # creating the data for the histogram, interval = 1000,
    # range is minimun until 40000

    data = np.array(list)

    array_hist, edges = np.histogram(data, bins = int((500 + 40000)/1000),
                                     range = [500, 40000])

    histogram_gdp = pd.DataFrame({'number': array_hist,
                                  'left': edges[:-1],
                                  'right': edges[1:]})

    histogram.quad(bottom=0, top=histogram_gdp['number'],
                   left=histogram_gdp['left'], right=histogram_gdp['right'],
                   color='red', line_color='black')


    show(histogram)
















if __name__ == "__main__":
    parsed_file = loading("input.csv", "Country, Region, Pop. Density (per sq. mi.), \
                            Infant mortality (per 1000 births), Infant mortality (per 1000 births), \
                            GDP ($ per capita) dollars")
    file = parsing(parsed_file)
    calculations(file, "GDP ($ per capita) dollars")
