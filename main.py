from utils.dynamodb import dynamoDB
from logger import get_logger
import json
log = get_logger()
log.info("Application started")
db = dynamoDB()
music_schema =[{'AttributeName': 'artist','KeyType':'HASH'},{'AttributeName': 'title_year','KeyType':'RANGE'}]
music_attribute_definition = [{'AttributeName':'title_year','AttributeType':'S'},{'AttributeName':'artist','AttributeType':'S'}]
db.create_table("music",music_schema,music_attribute_definition)


with open("resources/2026a2_songs.json", "r") as file:
    data = json.load(file)
    for item in data['songs']:
        item["title_year"] = f"{item['title']}#{item['year']}"
    db.batch_load("music",data['songs']) #Exception Handling Might be necessary for this check later
    log.info("Batch load completed")


