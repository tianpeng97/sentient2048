from flask_login import UserMixin
from app import db, login
from datetime import datetime

class User(UserMixin, db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30))
    password = db.Column(db.String(30))
    role = db.Column(db.String(6))
    score = db.Column(db.Integer, default=0)
    member_since = db.Column(db.DateTime, default=datetime.now())
    is_active = db.Column(db.Integer, default=1)
    moves = db.Column(db.Integer, default=0)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'score': self.score,
            'member_since': self.member_since,
            'is_active': self.is_active,
            'moves': self.moves
        }

    def __init__(self, username, password, role):
        self.username = username
        self.password = password
        self.role = role

    def __repr__(self):
        return '<User {}>'.format(self.username)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))