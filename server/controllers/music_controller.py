from boto3.dynamodb.conditions import Attr
from server.utils.dynamodb import dynamoDB
from server.utils.s3 import s3

db = dynamoDB()
bucket = s3()

# def get_musiwswc(schema):
#     if "artist" in schema:
#         items = db.query_items("music", "artist", schema["artist"])
#     else:
#         items = db.get_item("music", schema)

#     keys = []

#     for item in items:
#         artist = item["artist"].replace(" ", "_")
#         title = item["title_year"].replace(" ", "_")
#         key = f"music/{artist}_{title}.jpg"
#         keys.append(key)

#     results = bucket.get_from_bucket("s4139282picturebucket", keys)

#     return {"jpg": results, "details": items}
def post_filter(items, filter_attrs):
    return [
        item for item in items
        if all(item.get(k) == v for k, v in filter_attrs.items())
    ]
def get_music(schema):
    artist = schema.get("artist")
    title = schema.get("title")
    year = schema.get("year")

    filter_attrs = {k: v for k, v in schema.items() 
                    if k not in ["artist", "title", "year"]}

    if artist and title and year:
        items = db.get_item_by_key("music", artist, f"{title}#{year}")

    elif artist and title:
        items = db.query_items_lsi("music", "title_lsi", artist, "title", title)

    elif artist and year:
        
        items = db.query_items_lsi("music", "year_lsi", artist, "year", year)

    elif artist:
        items = db.query_items("music", "artist", artist)

    elif title and year:
        items = db.query_items_gsi("music", "title_gsi", "title", title, "year", year)

    elif title:
        items = db.query_items_gsi("music", "title_gsi", "title", title)

    elif year:
        items = db.query_items_gsi("music", "year_gsi", "year", year)

    else:
        items = db.scan_items("music", schema)

    if filter_attrs:
        items = post_filter(items, filter_attrs)

    return items

def subscribe_music(data):
    user_email = data["user_email"]
    song = data["song"]

    existing = db.get_item("subscriptions", {
        "user_email": user_email,
        "title": song["title"],
        "artist": song["artist"],
        "year": song["year"]
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
    artist = data["artist"]
    year = data["year"]

    table = db.dynamodb.Table("subscriptions")

    response = table.scan(
        FilterExpression=
            Attr("user_email").eq(user_email) &
            Attr("title").eq(title) &
            Attr("artist").eq(artist) &
            Attr("year").eq(year)
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