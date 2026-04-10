from utils.create_dynamodb_table import create_dynamodb_table
from logger import get_logger

log = get_logger()
log.info("Application started")
create_dynamodb_table()