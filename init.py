from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Variables to import into main.py for activation
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt_manager = JWTManager()

# JWT user callback functionality
@jwt_manager.user_lookup_loader
def user_callback(_jwt_header, jwt_data):
    """
    Flask-JWT-Extended handles unique tokens upon login. 
    The function below accesses that token to load a user based on the decoded token data.
    Any time the JWT required function is called, this function will run to verify credentials.
    """
    from models.user import User # Imports the user model only when called
    identity = jwt_data["sub"]
    return db.session.get(User, identity)