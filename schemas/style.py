from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate, RAISE

from models import Style

class StyleSchema(SQLAlchemyAutoSchema):
    """Schema for styles both input and output as it is a lookup table"""
    class Meta:
        model = Style
        load_instance = True
        unknown = RAISE

    # Validation for fields:
    name = fields.String(
        required=True,
        validate=[validate.Length(max=32, error="Name cannot exceed 32 characters")]
    )
    description = fields.String(
        required=True,
        validate=[validate.Length(max=255, error="Description cannot exceed 255 characters")]
    )

style_schema = StyleSchema()
styles_schema = StyleSchema(many=True)