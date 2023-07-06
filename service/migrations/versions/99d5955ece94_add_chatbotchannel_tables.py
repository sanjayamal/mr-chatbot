"""add chatbotchannel tables

Revision ID: 99d5955ece94
Revises: da76e46f0135
Create Date: 2023-06-16 17:43:03.368472

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99d5955ece94'
down_revision = 'da76e46f0135'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chatbot_channels',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('chatbot_id', sa.String(), nullable=True),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['chatbot_id'], ['chatbots.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('chatbot_channel_main',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('chatbot_channel_id', sa.String(), nullable=True),
    sa.Column('initial_message', sa.String(), nullable=True),
    sa.Column('display_name', sa.String(), nullable=True),
    sa.Column('profile_picture_url', sa.String(), nullable=True),
    sa.Column('user_message_color', sa.String(), nullable=True),
    sa.Column('chat_bubble_color', sa.String(), nullable=True),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['chatbot_channel_id'], ['chatbot_channels.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('chatbot_channel_main')
    op.drop_table('chatbot_channels')
    # ### end Alembic commands ###