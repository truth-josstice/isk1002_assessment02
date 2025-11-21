import pytest
from sqlalchemy.exc import IntegrityError

from init import db
from models import Company, Gym
from schemas import gym_schema

def test_gym_schema_serialization(app):
    """Test gym schema includes company data when serialized"""
    
    with app.app_context():
        # Create test data
        company = Company(name="Schema Test Company", website="www.schema.com")
        db.session.add(company)
        db.session.commit()
        
        gym = Gym(
            company_id=company.id,
            name="Schema Test Gym",
            city="Schema City",
            street_address="123 Schema St"
        )
        db.session.add(gym)
        db.session.commit()
        
        # Serialize
        result = gym_schema.dump(gym)
        
        # Test the serialized output
        assert result["name"] == "Schema Test Gym"
        assert result["company_id"] == 1


def test_gym_model_invalid_company_id(app):
    """Test gym model directly with invalid company_id (bypassing route validation)"""
    # Create the gym with incorrect company ID
    with app.app_context():
        gym = Gym(
            company_id=9999,  # Invalid company ID
            name="Direct Test Gym",
            city="Test City",
            street_address="123 Test St"
        )
        
        db.session.add(gym)
        
        # Check for integrity error
        with pytest.raises(IntegrityError) as exc_info:
            db.session.commit()
        
        # Check the integrity error is based on foreign key constraints
        assert "foreign key constraint" in str(exc_info.value).lower()
        db.session.rollback()

def test_gym_creation_with_null_company_id(app):
    """Test that a gym cannot be created with a NULL company_id"""
    
    # Create the gym with invalid (null) company ID
    with app.app_context():
        gym = Gym(
            company_id=None,  # Explicitly None
            name="Null Company Gym",
            city="Test City",
            street_address="123 Test St"
        )
        
        db.session.add(gym)
        
        # Check for integrity error
        with pytest.raises(IntegrityError) as exc_info:
            db.session.commit()
        
        # Verify the error is related to null constraint
        assert "not null" in str(exc_info.value).lower()
        assert "company_id" in str(exc_info.value).lower()
        
        # Rollback the failed transaction
        db.session.rollback()
        
        # Verify no gym was actually created
        gym_count = Gym.query.count()
        assert gym_count == 0

def test_gym_creation_with_valid_company_id(app):
    """Test that a gym can be created with a valid company_id"""
    with app.app_context():
        # Create a valid company first
        company = Company(
            name="Valid Company",
            website="http://www.valid.com"
        )
        db.session.add(company)
        db.session.commit()
        
        # Create gym with valid company_id
        gym = Gym(
            company_id=company.id,  # Use the actual ID from the created company
            name="Valid Gym",
            city="Test City",
            street_address="123 Test St"
        )
        
        db.session.add(gym)
        db.session.commit()
        
        # Verify gym was created successfully
        gym_count = Gym.query.count()
        assert gym_count == 1
        
        # Verify the gym has the correct company relationship
        created_gym = Gym.query.first()
        assert created_gym.company_id == company.id
        assert created_gym.company.name == "Valid Company"