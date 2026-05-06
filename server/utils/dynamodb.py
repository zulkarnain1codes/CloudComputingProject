import boto3
from server.logger import get_logger
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr, Key

log = get_logger()

class dynamoDB:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

    def create_table(self, name, schema, attributedefinition):
        log.info("create_table function started")
        try:
            table = self.dynamodb.Table(name)
            table.load()
            log.info("Table already exists")
        except ClientError as e:
            if e.response["Error"]["Code"] == "ResourceNotFoundException":
                log.info("Table does not exist, creating...")
                table = self.dynamodb.create_table(
                    TableName=name,
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
                raise

    def create_table_with_indexes(self, name, schema, attribute_definitions,
                                  lsi=None, gsi=None):
        # Checking if table already exists before trying to create it
        log.info(f"create_table_with_indexes called for {name}")
        try:
            table = self.dynamodb.Table(name)
            table.load()
            log.info(f"Table {name} already exists")
            return
        except ClientError as e:
            if e.response["Error"]["Code"] != "ResourceNotFoundException":
                log.error(e)
                raise

        # Building table config including LSI and GSI if provided
        params = {
            'TableName': name,
            'KeySchema': schema,
            'AttributeDefinitions': attribute_definitions,
            'ProvisionedThroughput': {'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5}
        }
        if lsi:
            params['LocalSecondaryIndexes'] = lsi
        if gsi:
            params['GlobalSecondaryIndexes'] = gsi

        table = self.dynamodb.create_table(**params)
        table.wait_until_exists()
        log.info(f"Table {name} created")

    def batch_load(self, name, collection):
        log.info("batch_load function started")
        table = self.dynamodb.Table(name)
        with table.batch_writer() as batch:
            for item in collection:
                batch.put_item(Item=item)

    def put_item(self, name, item):
        log.info("put_item function started")
        table = self.dynamodb.Table(name)
        table.put_item(Item=item)

    def build_filter_expression(self, filters):
        filter_expr = None
        for key, value in filters.items():
            condition = Attr(key).eq(value)
            filter_expr = condition if filter_expr is None else filter_expr & condition
        return filter_expr

    def get_item(self, name, schema):
        # Using Scan with filter — for multi-field queries without index
        table = self.dynamodb.Table(name)
        expression = self.build_filter_expression(schema)
        response = table.scan(FilterExpression=expression)
        return response['Items']

    def query_items(self, name, key_name, key_value):
        # Using Query on partition key — faster than Scan
        table = self.dynamodb.Table(name)
        response = table.query(
            KeyConditionExpression=Key(key_name).eq(key_value)
        )
        return response.get("Items", [])

    def query_lsi(self, name, index_name, partition_value, sort_value):
        # Querying Local Secondary Index with partition + sort key
        table = self.dynamodb.Table(name)
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression=Key("artist").eq(partition_value) & Key("year").eq(sort_value)
        )
        return response.get("Items", [])

    def query_gsi(self, name, index_name, partition_value):
        # Querying Global Secondary Index by year partition key
        table = self.dynamodb.Table(name)
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression=Key("year").eq(partition_value)
        )
        return response.get("Items", [])

    def delete_item(self, name, key):
        # Deleting a single item by its primary key
        table = self.dynamodb.Table(name)
        table.delete_item(Key=key)