import os

import pinecone
from dotenv import load_dotenv

load_dotenv()

pinecone.init(api_key=os.getenv("PINECONE_API_KEY"),
              environment=os.getenv("PINECONE_ENVIRONMENT"))


def delete_pinecone_index(namespace):
    index = pinecone.Index(index_name=os.getenv("PINECONE_INDEX"))
    index.delete(delete_all=True, namespace=namespace)
