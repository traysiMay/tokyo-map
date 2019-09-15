import csv
import json
thisdict = {}
with open('tokyos.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        obj = {'file':row[0], 'extension':row[2], 'lat':row[3], 'lon':row[4]}
        if row[1] not in thisdict:
            thisdict[row[1]] = [obj]
        else:
            thisdict[row[1]].append(obj)

with open('result.json', 'w') as outfile:
    json.dump(thisdict, outfile)
