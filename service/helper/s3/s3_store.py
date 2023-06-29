from helper.s3.certificate_reader import get_custom_tls_config
import boto3
import botocore.config
import requests
from botocore.exceptions import ClientError, BotoCoreError
from requests.adapters import HTTPAdapter, Retry


def get_s3_store(ca_file_path):
    # Configure AWS region
    aws_region = "us-east-1"

    # Create a custom HTTP client
    custom_adapter = HTTPAdapter(
        max_retries=Retry(total=5, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504])
    )
    custom_transport = requests.Session()
    custom_transport.mount("https://", custom_adapter)

    # Read TLS configuration from PEM file
    try:
        tls_config, error = get_custom_tls_config(ca_file_path)
        if error:
            return None, error
    except Exception as e:
        return None, e

    custom_transport.verify = ca_file_path
    custom_transport.cert = tls_config.get_ca_certs()[0]

    # Configure custom HTTP client in the botocore config
    botocore_config = botocore.config.Config(region_name=aws_region)
    botocore_config.http_adapter = custom_adapter
    botocore_config.http_client = custom_transport

    # Create S3 client with the custom configuration
    s3_client = boto3.client('s3', config=botocore_config)
    return s3_client, None


def create_presigned_url(ca_path, bucket_name, object_name, expiration=7200):
    print("inside create_presigned_url...")
    response = None
    try:
        s3, err = get_s3_store(ca_file_path=ca_path)
        if err is None:
            response = s3.generate_presigned_url('get_object',
                                                 Params={'Bucket': bucket_name,
                                                         'Key': object_name},
                                                 ExpiresIn=expiration)
            print(response)
        else:
            print(err)
    except ClientError as e:
        print(e)
        return None
    return response