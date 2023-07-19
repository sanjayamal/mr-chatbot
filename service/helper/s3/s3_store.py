import boto3
from botocore.exceptions import ClientError, BotoCoreError


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


def get_s3_file_names(bucket_name, directory):

    try:
        s3_client = boto3.client('s3')
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=directory)

        file_names = []
        for obj in response.get('Contents', []):
            # Exclude directories and subdirectories
            if not obj['Key'].endswith('/'):
                file_path = obj['Key']
                file_name = file_path.split('/')[-1]  # Extract the file name
                file_names.append(file_name)
        return file_names

    except (BotoCoreError, ClientError) as e:
        print("Error occurred: {}".format(e))
        return []
