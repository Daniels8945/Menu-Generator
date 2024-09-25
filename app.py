
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import os
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__, template_folder="templates")
basedir = os.path.abspath(os.path.dirname(__file__))

CORS(app, resources={r"/all_menu": {"origins": "http://localhost:3000"}}) 


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db') 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    now = datetime.now()
    created_at = now.strftime("%d-%m-%y")
    last_modified = now.strftime("%d-%m-%y")

    def __repr__(self):
        return f"{self.id} - {self.name} - {self.category} - {self.price}"
    

with app.app_context():
    db.create_all()

@app.route("/add_menu")
def home():
    menu = Menu.query.all()
    return render_template("index.html", menu=menu)

@app.route("/all_menu")
def all_menu():
    menus = Menu.query.all()
    
    output = []
    for menu in menus:
        menu_data = {'id': menu.id, 'name': menu.name, 'category': menu.category, 'price': menu.price}
        output.append(menu_data)
    return (output)


@app.route('/get_menu/<id>',  methods=["GET"])
def get_menu(id):
    menu = Menu.query.get_or_404(id)
    return {
        'name': menu.name,
        'category': menu.category,
        'price' : menu.price,
        'created_at': menu.created_at,
        'last_modified': menu.last_modified
        }

@app.route('/edit_menu/<int:id>', methods=["GET", "POST"])
def edit_menu(id):
    menu = Menu.query.get_or_404(id)
    if request.method == "POST":
        data = request.get_json()
        menu.name = data.get('name', menu.name)
        menu.category = data.get('category', menu.category)
        menu.price = data.get('price', menu.price)
        db.session.commit()
        return jsonify(success=True)
    return render_template('index.html', menu=menu)


    

@app.route('/add_menu', methods=['POST'])
def add_menu():
    data = request.get_json()
    new_item = Menu(name=data['name'],
                    category=data['category'],
                    price=data['price'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify(success=True, id=new_item.id)

@app.route('/delete_menu/<id>', methods=['DELETE'])
def delete_menu(id):
    menu = Menu.query.get(id)
    if menu is None:
        return {"Error": "Not found"}
    db.session.delete(menu)
    db.session.commit()
    return {"message": "Successfully removed menu from list"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)