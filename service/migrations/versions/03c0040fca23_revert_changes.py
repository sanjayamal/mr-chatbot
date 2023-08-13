"""revert changes

Revision ID: 03c0040fca23
Revises: bd0de925b24b
Create Date: 2023-08-12 21:22:09.582178

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '03c0040fca23'
down_revision = 'bd0de925b24b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chatbot_channel_main', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id', sa.String(), nullable=False))
        batch_op.drop_column('main_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chatbot_channel_main', schema=None) as batch_op:
        batch_op.add_column(sa.Column('main_id', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.drop_column('id')

    # ### end Alembic commands ###