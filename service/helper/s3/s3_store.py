import os

import boto3
from botocore.exceptions import ClientError, BotoCoreError


def create_presigned_url(bucket_name, object_name, expiration=7200):
    response = None
    try:
        s3_client = boto3.Session(
            profile_name=os.getenv('AWS_PROFILE_NAME')).client(
            's3',
            region_name='eu-north-1',
            config=boto3.session.Config(
                signature_version='s3v4'))
        response = s3_client.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': bucket_name,
                'Key': object_name},
            ExpiresIn=expiration)

    except ClientError as e:
        print(e)
        return None
    return response


def get_s3_file_names(bucket_name, directory):

    try:
        s3_client = get_S3_client()
        response = s3_client.list_objects_v2(
            Bucket=bucket_name, Prefix=directory)

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


def delete_s3_files(bucket_name, file_names):
    try:
        s3_client = get_S3_client()
        objects = [{'Key': file_name} for file_name in file_names]
        response = s3_client.delete_objects(
            Bucket=bucket_name, Delete={
                'Objects': objects})

        deleted_files = [obj['Key'] for obj in response.get('Deleted', [])]
        for file in deleted_files:
            print(file)

        errors = response.get('Errors', [])
        if errors:
            print("Failed to delete files:")
            for error in errors:
                print(
                    f"File: {error['Key']}, Code: {error['Code']}, Message: {error['Message']}")

    except (BotoCoreError, ClientError) as error:
        # Handle specific exceptions as needed
        print("Error occurred: {}".format(error))
        return error


def get_s3_object(bucket_name, object_key):
    try:
        s3_client = get_S3_client()
        response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        return response
    except Exception as error:
        print("Error occurred: {}".format(error))
        return error


def get_S3_client():
    session = boto3.Session(profile_name=os.getenv('AWS_PROFILE_NAME'))
    s3_client = session.client('s3')
    return s3_client
