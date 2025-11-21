from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate, RAISE

from models import Climb

class ClimbInputSchema(SQLAlchemyAutoSchema):
    """Input schema for users to add climbs including all validation"""
    class Meta:
        model = Climb
        load_instance = True
        include_fk = True
        unknown = RAISE

    # Validation for fields:
    gym_id = fields.Integer(required=True)
    user_id = fields.Integer(required=True)
    style_id = fields.Integer(required=True)
    difficulty_grade = fields.Integer(
        required=True,
        validate=[validate.Length(max=32, error="Difficulty grade cannot exceed 32 characters")]
    )
    set_date = fields.Date(required=False)

class ClimbOutputSchema(SQLAlchemyAutoSchema):
    """Display schema with customised fields for clean and simplified display"""
    class Meta:
        model = Climb
        load_instance = True
        include_fk = True
        include_relationships = True
        fields = ("id", "gym_name", "username", "style_name", "difficulty_grade", "set_date")
        ordered = True
    
    # Custom output fields using all relationships
    gym_name = fields.String(attribute="gym.name")
    username = fields.String(attribute="user.username")
    style_name = fields.String(attribute="styles.name")

climb_input_schema = ClimbInputSchema()
climb_inputs_schema = ClimbInputSchema(many=True)
climb_output_schema = ClimbOutputSchema()
climbs_output_schema = ClimbOutputSchema(many=True)