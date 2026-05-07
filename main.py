from server.utils.dynamodb import dynamoDB
from server.utils.s3 import s3
from server.logger import get_logger
import json
import requests

log = get_logger()
db = dynamoDB()
bucket = s3()

# 1. CREATE AND LOAD LOGIN TABLE 

login_schema = [{'AttributeName': 'email', 'KeyType': 'HASH'}]
login_attrs  = [{'AttributeName': 'email', 'AttributeType': 'S'}]
db.create_table("login", login_schema, login_attrs)

users = [
    {"email": "s3897423@student.rmit.edu.au", "user_name": "Alice",   "password": "Pass1234"},
    {"email": "s3812045@student.rmit.edu.au", "user_name": "Bob",     "password": "Pass1234"},
    {"email": "s3756891@student.rmit.edu.au", "user_name": "Charlie", "password": "Pass1234"},
    {"email": "s3943210@student.rmit.edu.au", "user_name": "Diana",   "password": "Pass1234"},
    {"email": "s3678234@student.rmit.edu.au", "user_name": "Edward",  "password": "Pass1234"},
    {"email": "s3821567@student.rmit.edu.au", "user_name": "Fiona",   "password": "Pass1234"},
    {"email": "s3712389@student.rmit.edu.au", "user_name": "George",  "password": "Pass1234"},
    {"email": "s3890124@student.rmit.edu.au", "user_name": "Hannah",  "password": "Pass1234"},
    {"email": "s3765432@student.rmit.edu.au", "user_name": "Ivan",    "password": "Pass1234"},
    {"email": "s3834901@student.rmit.edu.au", "user_name": "Julia",   "password": "Pass1234"},
]
db.batch_load("login", users)


# 2.CREATE MUSIC TABLE 

music_schema = [
    {'AttributeName': 'artist', 'KeyType': 'HASH'},
    {'AttributeName': 'title_year', 'KeyType': 'RANGE'}
]

music_attribute_definition = [
    {'AttributeName': 'artist', 'AttributeType': 'S'},
    {'AttributeName': 'title_year', 'AttributeType': 'S'},
    {'AttributeName': 'title', 'AttributeType': 'S'},
    {'AttributeName': 'year', 'AttributeType': 'S'},
]

music_lsi = [
    {
        'IndexName': 'title_lsi',
        'KeySchema': [
            {'AttributeName': 'artist', 'KeyType': 'HASH'},
            {'AttributeName': 'title', 'KeyType': 'RANGE'}
        ],
        'Projection': {'ProjectionType': 'ALL'}
    },
    {
        'IndexName': 'year_lsi',
        'KeySchema': [
            {'AttributeName': 'artist', 'KeyType': 'HASH'},
            {'AttributeName': 'year', 'KeyType': 'RANGE'}
        ],
        'Projection': {'ProjectionType': 'ALL'}
    }
]

music_gsi = [
    {
        'IndexName': 'title_gsi',
        'KeySchema': [
            {'AttributeName': 'title', 'KeyType': 'HASH'},
            {'AttributeName': 'year', 'KeyType': 'RANGE'}
        ],
        'Projection': {'ProjectionType': 'ALL'},
        'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    },
    {
        'IndexName': 'year_gsi',
        'KeySchema': [
            {'AttributeName': 'year', 'KeyType': 'HASH'},
            {'AttributeName': 'title', 'KeyType': 'RANGE'}
        ],
        'Projection': {'ProjectionType': 'ALL'},
        'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
    }
]

db.create_table("music", music_schema, music_attribute_definition, music_lsi, music_gsi)

# 3. LOAD MUSIC DATA 
with open("resources/2026a2_songs.json", "r") as file:
    data = json.load(file)
    for item in data['songs']:
        item["title_year"] = f"{item['title']}#{item['year']}"
    db.batch_load("music",data['songs']) #Exception Handling Might be necessary for this check later
    log.info("Batch load completed")

table = db.dynamodb.Table("music")


# 4. DOWNLOAD AND UPLOAD IMAGES TO S3 BUCKET

response = table.scan(
    ProjectionExpression="artist,title_year,img_url"
)
items = response["Items"]
bucket.create_bucket(name="s4134986picturebucket")
for item in items:
    img_url = item["img_url"]

    artist = item["artist"].replace(" ", "_")
    title = item["title_year"].replace(" ", "_")

    try:
        img_data = requests.get(img_url).content
        key = f"music/{artist}_{title}.jpg"
        bucket.upload_to_bucket("s4134986picturebucket",key,img_data)

    except Exception as e:
        print(f"Failed for {img_url}: {e}")

# 5. CREATE SUBSCRIPTION TABLE

sub_schema =[{'AttributeName': 'user_email','KeyType':'HASH'},{'AttributeName': 'artist_title_year','KeyType':'RANGE'}]
sub_attribute_definition = [{'AttributeName':'user_email','AttributeType':'S'},{'AttributeName':'artist_title_year','AttributeType':'S'}]
db.create_table("subscriptions", sub_schema, sub_attribute_definition)