from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from marshmallow import fields, validate, RAISE

from models import User
from utils import validate_password_complexity

class UserOutputSchema(SQLAlchemyAutoSchema):
    """
    Display schema for user information display.
    NEVER sends password hash with its response.
    """
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        ordered = True
        fields = ("id", "username", "email", "first_name", "last_name", "user_skill_level")
    
    # SkillLevel relationship
    user_skill_level = Nested("SkillLevelSchema")

class UserInputSchema(SQLAlchemyAutoSchema):
    """
    Input schema for users used in register route of auth controller
    Requires virtual password field (_password_hash field in DB and user model) and
    hashes password data before storage. 
    """
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        fields = ("id", "username", "email", "password", "first_name", "last_name", "skill_level_id")
        unknown = RAISE

    # Validation for fields:
    username = fields.String(
        required=True,
        validate=[validate.Length(max=100, error="Username cannot exceed 100 characters")]
    )
    email = fields.Email(
        required=True,
        validate=[
            validate.Email(error="Please enter a valid email address"),
            validate.Length(max=254, error="Email cannot exceed 254 characters")]
    )
    password = fields.String(
        load_only=True, 
        required=True, 
        validate=validate_password_complexity # Custom validator function
    )
    first_name = fields.String(
        required=True,
        validate=[validate.Length(max=100, error="First name cannot exceed 100 characters")]
    )
    last_name = fields.String(
        required=False,
        validate=[validate.Length(max=100, error="Last name cannot exceed 100 characters")]
    )
    skill_level_id = fields.Integer(required=True)

user_output_schema = UserOutputSchema()
users_output_schema = UserOutputSchema(many=True)
user_input_schema = UserInputSchema()