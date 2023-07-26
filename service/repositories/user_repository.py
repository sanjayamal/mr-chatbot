from sqlalchemy import func

from entities.model import db, Review


class UserRepository:

    def __int__(self):
        self.db = db

    def add_review(self, review):
        print('call repo')
        if review is not None:
            print('call repo-inside')
            print(review)
            db.session.add(review)
        db.session.commit()


    def get_reviews(self):
        try:
            reviews = Review.query.filter_by(is_approved=True).order_by(func.random()).limit(10).all()
            return reviews
        except Exception as err:
            return err