from utils.dynamodb import dynamoDB
from logger import get_logger

log = get_logger()
log.info("Application started")
db = dynamoDB()
music_schema =[{'AttributeName': 'title','KeyType':'HASH'}]
music_attribute_definition = [{'AttributeName':'title','AttributeType':'S'}]
db.create_table("music",music_schema,music_attribute_definition)