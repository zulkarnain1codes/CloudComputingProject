import boto3
from server.logger import get_logger
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr, Key

log = get_logger()

class dynamoDB:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb', region_name='us-west-2')

    # def create_table(self, name, schema, attributedefinition):
    #     log.info("create_table function started")
    #     try:
    #         table = self.dynamodb.Table(name)
    #         table.load()
    #         log.info("Table already exists")

    #     except ClientError as e:
    #         if e.response["Error"]["Code"] == "ResourceNotFoundException":
    #             log.info("Table does not exist, creating...")
    #             table = self.dynamodb.create_table(
    #                 TableName=name,
    #                 KeySchema=schema,
    #                 AttributeDefinitions=attributedefinition,
    #                 ProvisionedThroughput={
    #                     'ReadCapacityUnits': 5,
    #                     'WriteCapacityUnits': 5
    #                 }
    #             )
    #             table.wait_until_exists()
    #         else:
    #             log.error(e)
    #             raise


    def create_table(self, name, schema, attributedefinition, lsi=None, gsi=None):
        log.info("create_table function started")
        try:
            table = self.dynamodb.Table(name)
            table.load()
            log.info("Table already exists")
        except ClientError as e:
            if e.response["Error"]["Code"] == "ResourceNotFoundException":
                log.info("Table does not exist, creating...")
                
                kwargs = {
                    'TableName': name,
                    'KeySchema': schema,
                    'AttributeDefinitions': attributedefinition,
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
                
                # only add if provided
                if lsi:
                    kwargs['LocalSecondaryIndexes'] = lsi
                if gsi:
                    kwargs['GlobalSecondaryIndexes'] = gsi

                table = self.dynamodb.create_table(**kwargs)
                table.wait_until_exists()
            else:
                log.error(e)
                raise

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

    def scan_items(self, name, schema):
        # Using Scan with filter — for multi-field queries without index
        table = self.dynamodb.Table(name)
        expression = self.build_filter_expression(schema)
        response = table.scan(FilterExpression=expression)
        items = response['Items']
        return items
    
    def get_item_by_key(self, name, artist, title_year):
    # Exact match — most efficient, O(1)
        table = self.dynamodb.Table(name)
        response = table.get_item(
            Key={"artist": artist, "title#year": title_year}
        )
        item = response.get("Item")
        return [item] if item else []
    
    def query_items_lsi(self, name, index_name, artist, sk_name, sk_value):
        table = self.dynamodb.Table(name)
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression=
                Key("artist").eq(artist) &
                Key(sk_name).eq(sk_value)
        )
        return response.get("Items", [])
    
    def query_items_gsi(self, name, index_name, pk_name, pk_value, sk_name=None, sk_value=None):
        table = self.dynamodb.Table(name)
        
        key_condition = Key(pk_name).eq(pk_value)
        
        if sk_name and sk_value:
            key_condition = key_condition & Key(sk_name).eq(sk_value)
        
        response = table.query(
            IndexName=index_name,
            KeyConditionExpression=key_condition
        )
        
        return response.get("Items", [])


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