from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate, RAISE

from models import SkillLevel

class SkillLevelSchema(SQLAlchemyAutoSchema):
    """Schema for skill levels both input and display as it is a lookup table"""
    class Meta:
        model = SkillLevel
        load_instance = True
        unknown = RAISE

    # Validation for fields:
    level = fields.String(
        required=True,
        validate=[validate.Length(max=32, error="Level cannot exceed 32 characters")]
    )
    description = fields.String(
        required=True,
        validate=[validate.Length(max=255, error="Description cannot exceed 255 characters")]
    )

skill_level_schema = SkillLevelSchema()
skill_levels_schema = SkillLevelSchema(many=True)