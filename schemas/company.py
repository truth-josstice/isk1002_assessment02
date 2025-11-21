from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import RelatedList, Nested
from marshmallow import fields, validate, RAISE

from models import Company
# from schemas.gym_schema import GymSchema

class CompanySchema(SQLAlchemyAutoSchema):
    """Both input and display schema for company as it is a simple entity and display"""
    class Meta:
        model = Company
        load_instance = True
        ordered=True
        fields=("id", "name", "website", "gym")
        unknown = RAISE
    
    # Gym relationship
    gym=RelatedList(Nested("GymSchema", only=("name", "street_address")))

    # Validation for fields:
    name = fields.String(
        required=True,
        validate=[validate.Length(max=100, error="Company name must be under 100 characters")]
        )
    website = fields.Url(
        required=True,
        validate=[
            validate.Length(max=1000, error="Website must be under 1000 characters"),
            validate.URL(error="Please provide a valid URl")]
    )

company_schema = CompanySchema()
companies_schema = CompanySchema(many=True)