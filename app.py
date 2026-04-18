from flask import Flask, render_template, request, redirect, url_for
from utils.dynamodb import dynamoDB

app = Flask(__name__)
db = dynamoDB()

@app.route('/')
def home():
    return redirect(url_for('register'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None

    if request.method == 'POST':
        email = request.form['email'].strip()
        username = request.form['username'].strip()
        password = request.form['password'].strip()

        existing_users = db.get_item("login", {"email": email})

        if existing_users:
            error = "The email already exists"
            return render_template("register.html", error=error)

        new_user = {
            "email": email,
            "user_name": username,
            "password": password
        }

        db.put_item("login", new_user)
        return redirect(url_for('login'))

    return render_template("register.html", error=error)

@app.route('/login')
def login():
    return render_template("login.html")

if __name__ == '__main__':
    app.run(debug=True)