import os

class Config(object):
    SECRET_KEY = os.environ['SECRET_KEY']
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL'].replace('postgres://', 'postgresql://')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ['SQLALCHEMY_TRACK_MODIFICATIONS']