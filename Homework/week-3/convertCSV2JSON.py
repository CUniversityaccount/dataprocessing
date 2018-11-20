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

def json_document(file, variables):
    variables = variables.split(", ")
    new_file = []
    dict = {}

    # reads the file and sort them
    with open(file) as document:
        import_file = csv.reader(document)
        text = csv.DictReader(document)
        for count, row in enumerate(text):
            for key, item in row.items():
                item = deepcopy(item.strip())

                # strips the spaces out of key and look
                # if the item contains a string or float
                if item == '' and key.strip() in variables:
                    dict.update({key: np.nan})
                elif key.strip() in variables:
                    try:
                        dict.update({key.strip(): float(item.strip())})
                    except:
                        dict.update({key: item.replace(" ", "")})


            # checks if there is data in the dictionary
            if dict != {}:
                new_file.append(dict)
                dict = {}

        dataframe = pd.DataFrame(new_file)

        try:
            column = dataframe.columns[dataframe.isnull().all()].tolist()
        except:
            print("No Nan in whole columns")
        dataframe = dataframe.drop(columns=column)
        data = dataframe.to_json(orient='records')
        data = json.loads(data)

        with open('data_knmi.json', 'w') as outfile:
            json.dump(data, outfile, indent=4)


if __name__ == "__main__":
    csv_document("knmi_data.txt")
    file = ("YYYYMMDD, TG")
    json_document("knmi_data.csv", file)
