import boto3
from logger import get_logger
from botocore.exceptions import ClientError
log = get_logger()
class dynamoDB:

    def create_table(self,name,schema,attributedefinition):
        log.info("create_table function started")
        dynamodb = boto3.resource('dynamodb')
        try:
            dynamodb.Table(name)
            log.info("Table already exists")
            
        except ClientError as e :
            if e.response["Error"]["Code"] == "ResourceNotFoundException":
                log.info("Table does not exist, creating...")
                table = dynamodb.create_table(
                TableName= name,
                KeySchema=schema,
                AttributeDefinitions=attributedefinition,
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
                )
                table.wait_until_exists()
            else:
                log.error(e)
                

