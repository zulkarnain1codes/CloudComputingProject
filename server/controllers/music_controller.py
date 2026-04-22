from boto3.dynamodb.conditions import Attr
from server.utils.dynamodb import dynamoDB
from server.utils.s3 import s3

db = dynamoDB()
bucket = s3()

def get_music(schema):
    if "artist" in schema:
        items = db.query_items("music", "artist", schema["artist"])
    else:
        items = db.get_item("music", schema)

    keys = []

    for item in items:
        artist = item["artist"].replace(" ", "_")
        title = item["title_year"].replace(" ", "_")
        key = f"music/{artist}_{title}.jpg"
        keys.append(key)

    results = bucket.get_from_bucket("s4139282picturebucket", keys)

    return {"jpg": results, "details": items}


def subscribe_music(data):
    user_email = data["user_email"]
    song = data["song"]

    existing = db.get_item("subscriptions", {
        "user_email": user_email,
        "title": song["title"]
    })

    if len(existing) > 0:
        return {"message": "Already subscribed"}

    item = {
        "user_email": user_email,
        "title": song["title"],
        "artist": song["artist"],
        "album": song["album"],
        "year": song["year"],
        "img_url": song["img_url"]
    }

    db.put_item("subscriptions", item)

    return {"message": "Subscribed successfully"}


def get_subscriptions(data):
    user_email = data["user_email"]

    items = db.get_item("subscriptions", {
        "user_email": user_email
    })

    return {"subscriptions": items}


def remove_subscription(data):
    user_email = data["user_email"]
    title = data["title"]

    table = db.dynamodb.Table("subscriptions")

    response = table.scan(
        FilterExpression=Attr("user_email").eq(user_email) &
                         Attr("title").eq(title)
    )

    items = response.get("Items", [])

    for item in items:
        table.delete_item(
            Key={
                "user_email": item["user_email"],
                "title": item["title"]
            }
        )

    return {"message": "Removed"}