import boto3
from server.logger import get_logger
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
log = get_logger()
class dynamoDB:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb', region_name="us-west-2")
    def create_table(self,name,schema,attributedefinition):
        log.info("create_table function started")
        try:
            table = self.dynamodb.Table(name)
            table.load()
            log.info("Table already exists")
            
        except ClientError as e :
            if e.response["Error"]["Code"] == "ResourceNotFoundException":
                log.info("Table does not exist, creating...")
                table = self.dynamodb.create_table(
                TableName= name,
                KeySchema=schema,
                AttributeDefinitions=attributedefinition
                ,
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
                )
                table.wait_until_exists()
            else:
                log.error(e)
    def batch_load(self,name,collection):
        log.info("batch_load function started")
        table=self.dynamodb.Table(name)
        with table.batch_writer() as batch:
            for item in collection:
                batch.put_item(
                    Item=item
                )
    def build_filter_expression(self,filters):
        filter_expr = None

        for key, value in filters.items():
            condition = Attr(key).eq(value)

            if filter_expr is None:
                filter_expr = condition
            else:
                filter_expr = filter_expr & condition  # AND condition

        return filter_expr
    def get_item(self,name,schema):
        table=self.dynamodb.Table(name)
        expression = self.build_filter_expression(schema)
        response = table.scan(
        FilterExpression=expression
        )
        items = response['Items']
        return items

