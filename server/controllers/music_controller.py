from server.utils.dynamodb import dynamoDB
from server.utils.s3 import s3
db = dynamoDB()
bucket = s3()
def get_music(schema):
    items =db.get_item("music",schema)
    keys = []
    for item in items:
            artist = item["artist"].replace(" ", "_")
            title = item["title_year"].replace(" ", "_")
            key = f"music/{artist}_{title}.jpg"
            keys.append(key)
    results = bucket.get_from_bucket("s4139282picturebucket",keys)
    return {"jpg":results,"details":items}