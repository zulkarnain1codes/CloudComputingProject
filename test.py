import json
with open("resources/2026a2_songs.json", "r") as file:
    data = json.load(file)
    count = 0
    for item in data['songs']:
        count +=1
    print(count)