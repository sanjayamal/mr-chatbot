import mimetypes

import boto3
from flask import jsonify


def upload_files_to_store(files,user_id,chatbot_id):
    s3 = boto3.client('s3')
    file_dir = user_id + '/chatbot/' + str(chatbot_id)
    file_object_name = []
    try:
        for file in files:
            object_name = file_dir + "/" + file.filename
            file_object_name.append(object_name)
            content_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'
            s3.upload_fileobj(file, 'chatbot-store-dev-buket', object_name,ExtraArgs={'ContentType' : content_type})
        return file_object_name,None
    except Exception as e:
        return file_object_name,e