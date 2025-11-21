from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from marshmallow import fields, validate, RAISE

from models import GymRating

class GymRatingOutputSchema(SQLAlchemyAutoSchema):
    """Display schema for clean and simple display"""
    class Meta:
        model = GymRating
        load_instance = True
        include_fk = False
        include_relationships = True
        fields = ("gym", "user", "recommended_skill_level", "difficulty_rating", "review")
        ordered = True
    
    # Relationships customised for output
    recommended_skill_level = Nested("SkillLevelSchema", only=("level",))
    gym = Nested("GymSchema", only=("id", "name"))
    user = Nested("UserOutputSchema", only=("id", "username", "user_skill_level.level"))

gym_rating_output_schema = GymRatingOutputSchema()
gym_ratings_output_schema = GymRatingOutputSchema(many=True)

class GymRatingInputSchema(SQLAlchemyAutoSchema):
    """Input schema for gym ratings including all validation"""
    class Meta:
        model = GymRating
        load_instance = True
        include_fk = True
        unknown = RAISE

    # Validation for fields:
    user_id = fields.Integer(required=True)
    gym_id = fields.Integer(required=True)
    difficulty_rating = fields.Integer(
        required=True,
        validate=[validate.Range(min=1, max=10, error= "Ratings must be between 1-10")]
    )
    skill_level_id = fields.Integer(required=True)
    review = fields.String(
        required=False,
        validate=[validate.Length(max=500, error="Reviews cannot exceed 500 characters")]
    )

gym_rating_input_schema = GymRatingInputSchema()