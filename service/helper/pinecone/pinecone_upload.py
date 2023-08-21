import asyncio
import os
import traceback

from langchain.document_loaders import PyPDFLoader, S3FileLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone

from entities.model import Chatbot, db
from helper.s3.s3_store import create_presigned_url
from dotenv import load_dotenv

load_dotenv()
# select which embeddings we want to use
embeddings = OpenAIEmbeddings(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    model="text-embedding-ada-002")

os.environ['AWS_DEFAULT_PROFILE'] = os.getenv("AWS_PROFILE_NAME")


def get_text_source_chunks(text_source):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=0, separators=[" ", ",", "\n"])
    chunks = text_splitter.split_text(text_source)
    return chunks


def get_document_text_chunks(document):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=0)
    chunks = text_splitter.split_documents(document)
    return chunks


def store_vector_db(text, namespace):
    Pinecone.from_texts(text,
                        embeddings,
                        index_name=os.getenv("PINECONE_INDEX"),
                        namespace=namespace,
                        batch_size=96,
                        text_key='text'
                        )


async def upload_to_pinecone(app, files, text, namespace, chatbot_id):
    with app.app_context():
        try:
            # split the text_source into chunks
            if text != '':
                text_source_chunks = get_text_source_chunks(text)
                store_vector_db(text_source_chunks, namespace)

            for file in files:
                loader = S3FileLoader(os.getenv("S3_BUCKET_NAME"), file)
                document = loader.load()

                # split the documents into chunks
                file_texts = get_document_text_chunks(document)
                store_vector_db([t.page_content for t in file_texts], namespace)

                chatbot = Chatbot.query.get(str(chatbot_id))
                if chatbot:
                    chatbot.status = 1
                    db.session.commit()
        except Exception as e:
            traceback.print_exc()
            return "Vector Update Failed"


def run_upload_to_pinecone(app, files, text, namespace, chatbot_id):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(
        upload_to_pinecone(app, files, text, namespace, chatbot_id))
    loop.close()
