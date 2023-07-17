from langchain import LLMChain, PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import HumanMessagePromptTemplate, SystemMessagePromptTemplate, ChatPromptTemplate
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.memory import ConversationSummaryBufferMemory
import pinecone

import os
from dotenv import load_dotenv

load_dotenv()

# select which embeddings we want to use
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"), model="text-embedding-ada-002")
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"),
              environment=os.getenv("PINECONE_ENVIRONMENT"))


def get_chat_prompt(prompt_message):
    system_template = prompt_message + """
    ----------------
    {context}"""
    messages = [
        SystemMessagePromptTemplate.from_template(system_template),
        HumanMessagePromptTemplate.from_template("{question}"),
    ]
    chat_prompt = ChatPromptTemplate.from_messages(messages)
    return chat_prompt


def get_condense_question_prompt():
    _template = """Given the following conversation and a follow up question, rephrase the follow up question to be a 
    standalone question, in its original language. Even though there is a conversation, if the question is a 
    greeting, You also greet back in a nice way.

    Chat History:
    {chat_history}
    Follow Up Input: {question}
    Standalone question:"""
    CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template(_template)
    return CONDENSE_QUESTION_PROMPT


def get_chat_history(inputs) -> str:
    res = []
    for human, ai in inputs:
        res.append(f"Human:{human}\nAI:{ai}")
    return "\n".join(res)


def get_chain_config(chatbot):
    config = {}
    config['temperature'] = chatbot['temperature']
    config['model'] = chatbot['model']
    config['prompt_message'] = ['prompt_message']
    return config


def process_content(query, chat_history, chatbot):
    vector_store = Pinecone.from_existing_index(os.getenv("PINECONE_INDEX"), embeddings, text_key="text",
                                                namespace=chatbot['userId'] + '_' + chatbot['id'])

    config = get_chain_config(chatbot)

    llm = ChatOpenAI(temperature=config['temperature'], openai_api_key=os.getenv("OPENAI_API_KEY"),
                     model_name=config['model'])

    memory = ConversationSummaryBufferMemory(
        llm=llm,
        output_key='answer',
        memory_key='chat_history',
        return_messages=True)

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 20})

    question_generator = LLMChain(llm=llm, prompt=get_condense_question_prompt())
    doc_chain = load_qa_chain(llm, verbose=True, prompt=get_chat_prompt(config['prompt_message']))

    chain = ConversationalRetrievalChain(
        # memory=memory,
        retriever=retriever,
        return_source_documents=True,
        get_chat_history=lambda h: h,
        question_generator=question_generator,
        combine_docs_chain=doc_chain,
        max_tokens_limit=1000,
        verbose=True)
    result = chain({"question": query, "chat_history": chat_history})
    # chain.verbose = True
    return result
