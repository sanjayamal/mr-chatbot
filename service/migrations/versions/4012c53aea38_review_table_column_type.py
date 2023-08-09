"""review table column type

Revision ID: 4012c53aea38
Revises: 8ea0bd74a432
Create Date: 2023-07-25 12:42:05.021013

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4012c53aea38'
down_revision = '8ea0bd74a432'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reviews',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('content', sa.String(), nullable=True),
    sa.Column('is_approved', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('users_email_key', type_='unique')
        batch_op.drop_column('profile_picture_url')
        batch_op.drop_column('first_name')
        batch_op.drop_column('last_name')
        batch_op.drop_column('email')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('last_name', sa.VARCHAR(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('first_name', sa.VARCHAR(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('profile_picture_url', sa.VARCHAR(), autoincrement=False, nullable=True))
        batch_op.create_unique_constraint('users_email_key', ['email'])

    op.drop_table('reviews')
    # ### end Alembic commands ###
