from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
gauth = GoogleAuth()
drive = GoogleDrive(gauth)

def upload_files_to_store(files):
    for file in files:
        gfile = drive.CreateFile({'parents': [{'id': '1joCziEfVRn2h6us01W9pGsgVaCpN6Kuc'}]})
        # Read file and set it as the content of this instance.
        gfile.SetContentFile(file)
        gfile.Upload()  # Upload the file.