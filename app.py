from config import Config
from flask import Flask, render_template, flash, redirect, url_for, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user, login_user, logout_user
import json

app = Flask(__name__)
app.config.from_object(Config)
login = LoginManager(app)
db = SQLAlchemy(app)

from models import User
from forms import LoginForm, RegistrationForm

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', user=current_user)


@app.route('/score', methods=['POST'])
def score():
    if request.method == 'POST':
        score = request.get_json()['score']
        user = User.query.filter_by(username=current_user.username).first()
        if score > user.score:
            user.score = score
            db.session.commit()
    return make_response(jsonify({"message": "success"}), 200)


@app.route('/moves', methods=['POST'])
def moves():
    if request.method == 'POST':
        moves = request.get_json()['moves']
        user = User.query.filter_by(username=current_user.username).first()
        user.moves = moves
        db.session.commit()
    return make_response(jsonify({"message": "success"}), 200)


@app.route('/active_users', methods=['POST'])
def active_users():
    if request.method == 'POST':
        users = User.query.all()
        members = len(users)
        active_users = 0
        for user in users:
            if user.is_active:
                active_users += 1
    return make_response(jsonify({"active_users": active_users, "members": members}), 200)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        flash("Cannot register if already signed in.")
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(form.username.data, form.password.data)
        db.session.add(user)
        db.session.commit()
        # register and automatically logs in
        login_user(user)
        return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()

        if user is None:
            flash("Invalid username")
            return redirect(url_for('login'))
        elif user.password != form.password.data:
            flash("Invalid password")
            return redirect(url_for('login'))
        
        user.is_active = 1
        db.session.commit()
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('index'))
    return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    user = User.query.filter_by(username=current_user.username).first()
    user.is_active = 0
    db.session.commit()
    logout_user()
    return redirect(url_for('index'))


@app.route('/leaderboard')
def leaderboard():
    data = User.query.all()
    rows = json.dumps([User.serialize(user) for user in data], default=str)
    return make_response(rows, 200)