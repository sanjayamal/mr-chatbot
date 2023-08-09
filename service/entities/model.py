from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy_easy_softdelete.mixin import generate_soft_delete_mixin_class

db = SQLAlchemy()


class SoftDeleteMixin(generate_soft_delete_mixin_class()):
    # type hint for autocomplete IDE support
    deleted_at: datetime


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=None, onupdate=datetime.now)

    chatbots = db.relationship(
        'Chatbot',
        backref='users',
        lazy=True,
        cascade='all, delete-orphan')

    reviews = relationship("Review", back_populates="user")

    def __init__(self, id):
        self.id = id,

    def __repr__(self):
        return f"<User {self.id}>"

    def json(self):
        return {
            'id': self.id,
            'createdDate': str(self.created_at),
            'updatedData': str(self.updated_at)
        }


class Chatbot(db.Model, SoftDeleteMixin):
    __tablename__ = 'chatbots'

    id = db.Column(db.String(), primary_key=True)
    user_id = db.Column(db.String(), db.ForeignKey('users.id'))
    name = db.Column(db.String())
    model = db.Column(db.String())
    temperature = db.Column(db.Float())
    prompt_message = db.Column(db.String())
    text_source = db.Column(db.String())
    number_of_characters = db.Column(db.Integer())
    status = db.Column(db.Integer(), default=0)
    description = db.Column(db.String())

    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=None, onupdate=datetime.now)

    channels = db.relationship(
        'ChatbotChannel',
        backref='chatbot',
        lazy=True,
        cascade='all, delete-orphan')

    def __init__(self, id, user_id, name, model, temperature, prompt_message,
                 text_source, number_of_characters, status, description):
        self.id = id,
        self.user_id = user_id,
        self.name = name,
        self.model = model,
        self.temperature = temperature
        self.prompt_message = prompt_message
        self.text_source = text_source
        self.number_of_characters = number_of_characters
        self.status = status
        self.description = description

    def __repr__(self):
        return f"<Chatbot {self.name}>"

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'userId': self.user_id,
            'model': self.model,
            'temperature': self.temperature,
            'promptMessage': self.prompt_message,
            'textSource': self.text_source,
            'numberOfCharacters': self.number_of_characters,
            'status': self.status,
            'description': self.description,
            'createdDate': str(self.created_at),
            'updatedData': str(self.updated_at)
        }


class ChatbotChannel(db.Model, SoftDeleteMixin):
    __tablename__ = 'chatbot_channels'

    id = db.Column(db.String(), primary_key=True)
    chatbot_id = db.Column(db.String(), db.ForeignKey('chatbots.id'))
    type = db.Column(db.String())
    created_at = db.Column(db.DateTime, default=datetime.now)

    chatbot_channel_histories = relationship(
        'ChatbotChannelHistory',
        back_populates='chatbot_channel')

    __mapper_args__ = {
        'polymorphic_identity': 'chatbot_channels',
        'with_polymorphic': '*',
        "polymorphic_on": type
    }

    def __init__(self, id, chatbot_id, type='web'):
        self.id = id,
        self.chatbot_id = chatbot_id,
        self.type = type,

    def __repr__(self):
        return f"<ChatbotChannel {self.name}>"

    def json(self):
        return {
            'id': self.id,
            'chatbotId': self.chatbot_id,
            'type': self.type,
            'createdDate': str(self.created_at),

        }


class ChatbotChannelMain(ChatbotChannel, SoftDeleteMixin):
    __tablename__ = 'chatbot_channel_main'

    id = db.Column(db.String(), primary_key=True)
    chatbot_channel_id = db.Column(
        db.String(), db.ForeignKey('chatbot_channels.id'))
    initial_message = db.Column(db.String())
    display_name = db.Column(db.String())
    profile_picture_url = db.Column(db.String())
    user_message_color = db.Column(db.String())
    chat_bubble_color = db.Column(db.String())
    type = db.Column(db.String())
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=None, onupdate=datetime.now)

    chatbot_channels = db.relationship('ChatbotChannel', backref='channel_main')

    __mapper_args__ = {
        'polymorphic_identity': 'web',
    }

    def __init__(
            self,
            id,
            chatbot_id,
            initial_message,
            display_name,
            profile_picture_url,
            user_message_color,
            chat_bubble_color,
            type):
        self.id = id
        self.chatbot_id = chatbot_id
        self.initial_message = initial_message
        self.display_name = display_name
        self.profile_picture_url = profile_picture_url
        self.user_message_color = user_message_color
        self.chat_bubble_color = chat_bubble_color
        self.type = type

    def __repr__(self):
        return f"<ChatBotChannelWeb {self.display_name}>"

    def json(self):
        return {
            'id': self.id,
            'chatbotChannelId': self.chatbot_channel_id,
            'initialMessage': self.initial_message,
            'displayName': self.display_name,
            'type': self.type,
            'profilePictureUrl': self.profile_picture_url,
            'userMessageColor': self.user_message_color,
            'chatBubbleColor': self.chat_bubble_color,
            'createdDate': str(self.created_at),
        }


class ChatbotChannelHistory(db.Model):
    _tablename_ = 'chatbot_channel_history'

    id = db.Column(db.Integer, primary_key=True)
    chatbot_channel_id = db.Column(
        db.String(), db.ForeignKey('chatbot_channels.id'))
    history_metadata = db.Column(JSON)
    human_message = db.Column(db.Text())
    human_message_time = db.Column(db.DateTime, default=None)
    ai_message = db.Column(db.Text())
    ai_message_time = db.Column(db.DateTime, default=None)
    chatbot_channel = db.relationship(
        'ChatbotChannel',
        back_populates='chatbot_channel_histories')
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now)

    def __repr__(self):
        return f"<ChatBotChannelHistory {self.domain_name}>"

    def json(self):
        return {
            'id': self.id,
            'chatbotChannelId': self.chatbot_channel_id,
        }


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String())
    content = db.Column(db.String())
    rate = db.Column(db.Float())
    is_approved = db.Column(db.Boolean())
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=None, onupdate=datetime.now)

    user_id = db.Column(db.String(), db.ForeignKey('users.id'), nullable=False)

    # Define the back reference to the User table
    user = relationship("User", back_populates="reviews")

    def __init__(self, id, name, content, rate, is_approved,user_id):
        self.id = id
        self.name = name
        self.content = content
        self.rate = rate
        self.is_approved = is_approved
        self.user_id = user_id

    def __repr__(self):
        return f"<Review {self.name}>"

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'content': self.content,
            'rate': self.rate,
            'isApproved': self.is_approved,
            'createdDate': str(self.created_at),
            'updatedData': str(self.updated_at)
        }
