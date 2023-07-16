import boto3
from botocore.exceptions import ClientError


def create_presigned_url(bucket_name, object_name, expiration=7200):
    response = None
    try:
        s3_client = boto3.client('s3', region_name='eu-north-1', config=boto3.session.Config(signature_version='s3v4'))
        response = s3_client.generate_presigned_url(ClientMethod='get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)

    except ClientError as e:
        print(e)
        return None
    return response
