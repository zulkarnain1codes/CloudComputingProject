from server.utils.dynamodb import dynamoDB
from server.utils.s3 import s3
from server.logger import get_logger
import json
from boto3.dynamodb.conditions import Key, Attr
import requests
log = get_logger()
log.info("Application started")
db = dynamoDB()
bucket = s3()

music_schema =[{'AttributeName': 'artist','KeyType':'HASH'},{'AttributeName': 'title_year','KeyType':'RANGE'}]
music_attribute_definition = [{'AttributeName':'title_year','AttributeType':'S'},{'AttributeName':'artist','AttributeType':'S'}]
db.create_table("music",music_schema,music_attribute_definition)


# with open("resources/2026a2_songs.json", "r") as file:
#     data = json.load(file)
#     for item in data['songs']:
#         item["title_year"] = f"{item['title']}#{item['year']}"
#     db.batch_load("music",data['songs']) #Exception Handling Might be necessary for this check later
#     log.info("Batch load completed")
# table = db.dynamodb.Table("music")
# response = table.scan(
#     ProjectionExpression="artist,title_year,img_url"
# )

# items = response["Items"]
# print(items)
# bucket.create_bucket(name="s4139282picturebucket")
# for item in items:
#     img_url = item["img_url"]

#     artist = item["artist"].replace(" ", "_")
#     title = item["title_year"].replace(" ", "_")

#     try:
#         img_data = requests.get(img_url).content
#         key = f"music/{artist}_{title}.jpg"
#         bucket.upload_to_bucket("s4139282picturebucket",key,img_data)

#     except Exception as e:
#         print(f"Failed for {img_url}: {e}")
get_schema = {
    'artist':'Elton John','year':'1972'
}
items =db.get_item("music",get_schema)
print(items)
# keys = []
# for item in items:
#         artist = item["artist"].replace(" ", "_")
#         title = item["title_year"].replace(" ", "_")
#         key = f"music/{artist}_{title}.jpg"
#         keys.append(key)
# bucket.get_from_bucket("s4139282picturebucket",keys)