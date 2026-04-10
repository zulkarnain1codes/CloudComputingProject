import boto3
from logger import get_logger
log = get_logger()
def create_dynamodb_table():
    log.info("create_dynamodb_table function started")
    # dynamodb = boto3.resource('dynamodb')

