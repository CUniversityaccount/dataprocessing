import json
import csv
import re
import pandas as pd
from copy import deepcopy
import numpy as np

def csv_document(file):
    with open(file, 'r') as in_txt, open("knmi_data.csv", "w") as out_csv:
            data = (line.strip() for line in in_txt)
            csv_reader = csv.writer(out_csv, delimiter=',')
            for line in data:
                if "#" in line:
                    print(line)
                else:
                    line = line.split(',')
                    csv_reader.writerow(line)

def json_document(file):
    new_file = []
    dict = {}
    data = []
    total_data = []

    # reads the file and sort them
    with open(file) as document:
        import_file = csv.reader(document)
        text = csv.DictReader(document)
        for count, row in enumerate(text):
            for key, item in row.items():
                key = key.split(";")
                dict.update({" ".join(re.findall("\w+", key[0])): None})
                if item != None:
                    data.append(deepcopy(item.split(";")))

            if dict != {}:
                new_file.append(dict)
                dict = {}

        for count, item in enumerate(data):
            for number, key in enumerate(new_file[count]):
                new_file[count][key] = item[number]

        dataframe = pd.DataFrame(new_file)

        # removes all the colums with non data
        try:
            column = dataframe.columns[dataframe.isnull().all()].tolist()
        except:
            print("No Nan in whole columns")

        # prepare the data in a json file
        dataframe = dataframe.drop(columns=column)
        data = dataframe.to_json(orient='records')
        data = json.loads(data)

        with open('bevolking_bar.json', 'w') as outfile:
            json.dump(data, outfile, indent=4)


if __name__ == "__main__":

    json_document("Bevolking__kerncijfers_26112018_110116.csv")
