import boto3
from logger import get_logger
from botocore.exceptions import ClientError
from io import BytesIO
log = get_logger()


class s3:
    def __init__(self):
        self.s3 = boto3.client('s3')

    def create_bucket(self,name):
        log.info("create_bucket function started")
        bucket_name = name
        try:
            self.s3.create_bucket(
                Bucket =name,
                CreateBucketConfiguration={
                    'LocationConstraint': 'us-west-2'
                }
            )
        except ClientError as e:
            error_code = e.response['Error']['Code']

            if error_code == 'BucketAlreadyOwnedByYou':
                log.info(f"Bucket '{name}' already exists and is owned by you. Skipping creation.")
            else:
                raise 


        log.info("Bucket Created")
    def upload_to_bucket(self,name,key,item):
        log.info("upload_to_bucket function started")
        try:
            self.s3.upload_fileobj(
                BytesIO(item),
                name,
                key,
                ExtraArgs={"ContentType": "image/jpeg"}
            )
        except:
            raise
        log.info(f"Uploaded: {key}")
    def get_from_bucket(self, name, keys):
        log.info("download_multiple function started")

        results = []

        for key in keys:
            try:
                buffer = BytesIO()
                self.s3.download_fileobj(name, key, buffer)
                buffer.seek(0)

                results.append(buffer.read())
                log.info(f"Downloaded: {key}")

            except ClientError as e:
                log.error(f"Failed to download {key}: {e}")
                results.append(None)  # or skip if you prefer

        return results
