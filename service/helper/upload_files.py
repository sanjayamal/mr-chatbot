
import mimetypes
import os
import boto3


def upload_files_to_store(files, user_id, chatbot_id):
    s3 = boto3.client('s3')
    file_dir = user_id + '/chatbot/' + str(chatbot_id)
    file_object_name = []
    try:
        for file in files:
            file.seek(0)
            object_name = file_dir + "/" + file.filename
            file_object_name.append(object_name)
            content_type = mimetypes.guess_type(
                file.filename)[0] or 'application/octet-stream'
            if content_type == 'application/octet-stream' and file.filename.endswith(
                    '.pdf'):
                content_type = 'application/pdf'

            s3.upload_fileobj(
                file,
                os.getenv("S3_BUCKET_NAME"),
                object_name,
                ExtraArgs={
                    'ContentType': content_type})
        return file_object_name, None
    except Exception as e:
        return file_object_name, e
