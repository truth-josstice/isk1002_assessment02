from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate, RAISE

from models import Gym

class GymSchema(SQLAlchemyAutoSchema):
    """Schema for gym entities both input and display as it is a simple entity"""
    class Meta:
        model = Gym
        load_instance = True
        include_fk = False
        include_relationships = True
        fields=("id", "company_id", "name", "city", "street_address")
        ordered = True
        unknown = RAISE

    # Validation for fields:
    company_id = fields.Integer(required=True)
    city = fields.String(
        required=True,
        validate=[validate.Length(max=100, error="City cannot exceed 100 characters")]
    )
    street_address = fields.String(
        required=True,
        validate=[validate.Length(max=255, error="Street address cannot exceed 255 characters")]
    )
    name = fields.String(
        required=True,
        validate=[validate.Length(max=100, error="Name cannot exceed 100 characters")]
    )

gym_schema = GymSchema()
gyms_schema = GymSchema(many=True)