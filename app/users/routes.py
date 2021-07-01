from flask import (
    Blueprint,
    render_template,
    url_for,
    flash,
    redirect,
    request,
    current_app,
    session,
)
from flask_login import (
    login_user,
    logout_user,
    current_user,
    login_required,
)
from app import db, bcrypt
from app.models import User
from app.users.forms import RegistrationForm, LoginForm, AccountForm
from app.users.utils import save_picture, is_safe_url

users = Blueprint("users", __name__)


@users.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))

    form = RegistrationForm()

    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode(
            "utf-8"
        )
        user = User(
            username=form.username.data, email=form.email.data, password=hashed_password
        )
        db.session.add(user)
        db.session.commit()
        flash(f"Account created! You may now login", "success")
        return redirect(url_for("users.login"))

    return render_template("register.html", title="Register", form=form)


@users.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.home"))

    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()

        if user and bcrypt.check_password_hash(user.password, form.password.data):

            print(f"login_user info: {user}\nremember = {form.remember.data}")
            login_user(user, remember=form.remember.data)
            next_page = request.args.get("next")

            if not is_safe_url(next_page):
                return flask.abort(400)

            # return redirect(next_page) if next_page else redirect(url_for('main.home'))
            return redirect(next_page or url_for("main.home"))

        else:
            flash(
                f"Login unsuccessful. Please check credentials and try again.", "danger"
            )

    return render_template("login.html", title="Login", form=form)


@users.route("/logout")
def logout():
    session.clear()
    logout_user()

    return redirect(url_for("main.home"))


@users.route("/account", methods=["GET", "POST"])
@login_required
def account():
    form = AccountForm()

    if form.validate_on_submit():

        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            current_user.image_file = picture_file
        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash("Your account has been updated!", "success")
        return redirect(url_for("users.account"))

    elif request.method == "GET":
        form.username.data = current_user.username
        form.email.data = current_user.email

    image_file = url_for("static", filename="img/profile/" + current_user.image_file)

    return render_template(
        "account.html", title="Account Information", image_file=image_file, form=form
    )
