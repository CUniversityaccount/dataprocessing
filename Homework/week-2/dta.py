 #!/usr/bin/env python
# Name: Coen Mol
# Student number: 12309524
"""This script goes through the input file"""

import pandas as pd
from bokeh.plotting import figure, output_file, show
from bokeh.io import export_png
import numpy as np
import matplotlib.pyplot as plt
import re
import csv
import json

# loads the file and preprocess the data
def loading(file, variables):
    # load the variables that is need for sorting the data
    variables = variables.split(', ')
    for word in range(len(variables)):
        variables[word] = variables[word].strip()

    new_file = []
    dict = {}

    # reads the file and sort them
    with open(file) as document:
        import_file = csv.reader(document)
        text = csv.DictReader(document)
        for count, row in enumerate(text):
            for key, item in row.items():

                # strips the spaces out of key and look
                # if the item contains a string or float
                if key.strip() in variables and item != '':
                    try:
                        if item == "unknown":
                            dict.update({key: None})
                        else:
                            dict.update({key: item.strip()})
                    except:
                        pass

            # checks if there is data in the dictionary
            if dict != {}:
                new_file.append(dict)
                dict = {}

    return new_file

# puts the data in a dataframe
def parsing(file):
    data = file
    dataframe = pd.DataFrame(data)
    return dataframe

# makes a histogram
def histogram(file, selection):

    # max value is to remove the outliers
    max_value = 40000
    data = file
    list = data[selection].tolist()

    # get the numbers from the dataset
    for count in range(len(list)):

        # looks if the list contains a number, otherwise will skip the data
        try:
            if list[count] != None:
                number = re.findall(r'\d+', list[count])
                list[count] = float(number[0])
        except:
            pass

    # put the filtered data in a dataframe
    list = pd.DataFrame(list)

    # get the number where 98% is countries are above
    quantile_098 = list.quantile(0.98).tolist()
    list = list.clip(float(list.min()), float(quantile_098[0]))

    # calculates the mean, mode, median for the GDP
    mean = list.mean()
    median = list.median()
    mode = list.mode()


    # calculates the standard deviation
    standard_deviation = list.std()

    # creating the data for the histogram, interval = 1000,
    # range is minimun until 40000
    interval = 1000
    data = np.array(list)
    data = data[~np.isnan(data)]
    array_hist, edges = np.histogram(data, bins = int((list.min() + quantile_098[0])/interval),
                                     range = [int(list.min()), max_value])

    # makes histogram
    histogram_gdp = pd.DataFrame({'number': array_hist,
                                  'left': edges[:-1],
                                  'right': edges[1:]})
    histogram = figure(title="Histogram of GDP")
    histogram.xaxis.axis_label = "GDP"
    histogram.yaxis.axis_label = "Frequency"
    histogram.quad(bottom=0, top=histogram_gdp['number'],
                   left=histogram_gdp['left'], right=histogram_gdp['right'],
                   color='red', line_color='black')

    # export the png for further use
    export_png(histogram, filename="histogram.png")
    show(histogram.bokeh())

def five_number_summary(file, selection):
    data = file[selection].tolist()

    # check if there is , in the data and will change them to a point
    for count in range(len(data)):
        try:
            data[count] = float(data[count].replace(",", "."))
        except:
            pass

    # put the new data in a dataframe and drop non-saying data
    data = pd.DataFrame(data, columns=['data'])
    data = data.dropna()

    # calculates the fivepoimt summary and stores them in variables
    quantile_025 = data.quantile(0.25).tolist()
    median = data.median().tolist()
    quantile_075 = data.quantile(0.25).tolist()
    min = data.min().tolist()
    max = data.max().tolist()
    data.to_csv('data.csv', sep='\t', encoding='utf-8')

    # make figure
    plt.figure()
    plt.grid()
    plt.ylim((0, 200))
    plt.ylabel(selection)
    plt.boxplot(data['data'], showfliers=True)

    # save the plot as a png
    plt.show()
    plt.savefig('boxplot.png')

# creates JSON file
def json_file(file, selection):
    data = file
    data = data.replace(np.nan, 'null', regex=True)
    variables = selection.split(", ")
    dict = {}

    # split the different variables and creates a list
    for word in range(len(variables)):
        variables[word] = variables[word].strip()

    countries = data[variables[0]].values.tolist()

    # put the list in the dictionary
    data = data.set_index([variables[0]])
    for country in countries:
        list = data.loc[country].to_dict()
        dict.update({country : list})

    # makes the file with the correct lay-out
    with open('data.json', 'w') as outfile:
        json.dump(dict, outfile, indent=2)


if __name__ == "__main__":
    parsed_file = loading("input.csv", "Country, Region, Pop. Density (per sq. mi.), \
                            Infant mortality (per 1000 births), Infant mortality (per 1000 births), \
                            GDP ($ per capita) dollars")
    file = parsing(parsed_file)
    histogram(file, "GDP ($ per capita) dollars")
    five_number_summary(file, "Infant mortality (per 1000 births)")
    json_file(file, "Country, Region, Pop. Density (per sq. mi.), \
                            Infant mortality (per 1000 births), Infant mortality (per 1000 births), \
                            GDP ($ per capita) dollars")
