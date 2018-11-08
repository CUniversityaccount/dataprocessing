#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

class Information():
    def __init__(self, file, start_year, end_year):
        # Global constants for the input file, first and last year
        self.start_year = start_year
        self.end_year = end_year
        self.data = self.information(file)


    # load the data
    def information(self, file):
        with open(file) as file:
            reader = csv.reader(file)

            # Global dictionary for the data
            data_dict = {str(key): [] for key in range(self.start_year, self.end_year)}

            # puts the data in the dictionary
            for row in reader:
                for key in data_dict.keys():
                    if key in row:
                        data_dict[key].append(row)

        return data_dict

    def analyzing(self):
        # set up the data to get
        avarage_list = []
        avarage = 0

        for key in self.data.keys():

            # calculate the avarage rating
            if not None:
                for list in self.data[key]:
                    avarage += float(list[2])
                    counter += 1
                avarage = avarage / len(self.data[key])
                avarage_list.append(avarage)
                avarage = 0
        return avarage_list

    def line_char(self):
        x_axis = list(self.data.keys())
        y_axis = self.analyzing()

        # makes a graph
        plt.plot(x_axis, y_axis, 'bo', x_axis, y_axis, 'k')
        plt.axis([None, None, 8, 9])
        plt.suptitle("Avarage score per year")
        plt.xlabel("Years")
        plt.ylabel("Score")
        plt.show()


if __name__ == "__main__":

    # putting the right information and file in
    data = Information("movies.csv", 2008, 2018)

    # print graph
    data.line_char()
