
def get_object_url(bucket_name, key):
    url = 'https://' + bucket_name + '.s3.amazonaws.com/' + key
    return url
