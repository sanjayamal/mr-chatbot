"""delete

Revision ID: 8ea0bd74a432
Revises: eb87a7bd040d
Create Date: 2023-07-17 15:37:10.673613

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8ea0bd74a432'
down_revision = 'eb87a7bd040d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chatbot_channel_main', schema=None) as batch_op:
        batch_op.drop_column('deleted_at')

    with op.batch_alter_table('chatbot_channels', schema=None) as batch_op:
        batch_op.add_column(sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chatbot_channels', schema=None) as batch_op:
        batch_op.drop_column('deleted_at')

    with op.batch_alter_table('chatbot_channel_main', schema=None) as batch_op:
        batch_op.add_column(sa.Column('deleted_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
