from boto3.dynamodb.conditions import Attr
from server.utils.dynamodb import dynamoDB
from server.utils.s3 import s3

db = dynamoDB()
bucket = s3()

BUCKET = "s4139282-raga-music-2026"

def get_music(schema):
    # Using Query when only artist provided — uses partition key directly
    if "artist" in schema and len(schema) == 1:
        items = db.query_items("music", "artist", schema["artist"])

    # Using LSI when artist + year provided — efficient index lookup
    elif "artist" in schema and "year" in schema and len(schema) == 2:
        items = db.query_lsi("music", "artist-year-index",
                             schema["artist"], schema["year"])

    # Using GSI when only year provided — queries year-index
    elif "year" in schema and len(schema) == 1:
        items = db.query_gsi("music", "year-index", schema["year"])

    # Using Scan for all other combinations (title, album, mixed)
    else:
        items = db.get_item("music", schema)

    # Building S3 keys for each song image
    keys = []
    for item in items:
        artist = item["artist"].replace(" ", "_")
        title  = item["title"].replace(" ", "_")
        key    = f"music/{artist}_{title}.jpg"
        keys.append(key)

    # Generating presigned URLs from S3 for secure image access
    urls = bucket.get_from_bucket(BUCKET, keys)

    return {"jpg": urls, "details": items}


def subscribe_music(data):
    user_email = data["user_email"]
    song = data["song"]

    existing = db.get_item("subscriptions", {
        "user_email": user_email,
        "title": song["title"]
    })

    if existing:
        return {"message": "Already subscribed"}

    item = {
        "user_email": user_email,
        "title":      song["title"],
        "artist":     song["artist"],
        "album":      song.get("album", ""),
        "year":       song.get("year", ""),
        "img_url": song.get("img_url", "")
    }

    db.put_item("subscriptions", item)
    return {"message": "Subscribed successfully"}


def get_subscriptions(data):
    user_email = data["user_email"]
    # Using Query on subscriptions table — user_email is partition key
    items = db.query_items("subscriptions", "user_email", user_email)
    return {"subscriptions": items}


def remove_subscription(data):
    user_email = data["user_email"]
    title      = data["title"]

    # Deleting by primary key — user_email + title
    db.delete_item("subscriptions", {
        "user_email": user_email,
        "title":      title
    })
    return {"message": "Removed"}