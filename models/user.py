from init import db, bcrypt
from utils import validate_password_complexity

from marshmallow import ValidationError
from werkzeug.exceptions import BadRequest

class User(db.Model):
    '''
    Represents a user entity, the central entity in this API.

    Includes secure password storage and validation.

    Directly related to several entities.
    '''
    __tablename__ = "users"

    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(100), nullable=False, unique=True)
    _password_hash: str = db.Column(db.String, nullable=False) # Secure storage of passwords
    email: str = db.Column(db.String(320), nullable=False, unique=True)
    first_name: str = db.Column(db.String(100), nullable=False)
    last_name:str = db.Column(db.String(100))
    skill_level_id: int = db.Column(db.Integer,db.ForeignKey("skill_levels.id"),  nullable=False)
    is_admin: bool = db.Column(db.Boolean, default=False, nullable=False)

    # Set relationships, back population and cascade rules
    climbs = db.relationship("Climb", back_populates="user", cascade="all, delete-orphan")
    gym_rating = db.relationship("GymRating", back_populates="user", cascade="all, delete-orphan")
    attempt = db.relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    user_skill_level = db.relationship("SkillLevel", back_populates="user")

    # set password property and raise error if reading is requested
    @property
    def password(self):
        raise AttributeError("Password is write-only (cannot be read)")

    # set password attribute to be encrypted for storage in the database
    @password.setter
    def password(self, password):
        try:
            validate_password_complexity(password)
        except ValidationError as e:
            raise BadRequest(str(e))

        self._password_hash = bcrypt.generate_password_hash(password, rounds=12).decode('utf-8')

    # checks plain text input against encrypted hash stored in database
    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    