import pytest
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError

from init import db
from models import User, SkillLevel
from schemas import user_input_schema, user_output_schema
from tests.conftest import get_auth_header

def test_user_schema_serialization(app):
    """Test user schema serialization to JSON format"""
    with app.app_context():
        skill = SkillLevel(
            id = 1,
            level = "Beginner",
            description = "testdescription"
        )
        db.session.add(skill)
        db.session.commit()

        user = User(
            username="serial_test",
            email="serial@test.com",
            first_name="Serial",
            skill_level_id=skill.id,
            password="Test123!"  # Will be hashed by model
        )
        db.session.add(user)
        db.session.commit()

        result = user_output_schema.dump(user)
        
        assert result["username"] == "serial_test"
        assert "password" not in result  # Password should never be exposed when data is requested
        assert "_password_hash" not in result # Password hash should never be displayed when data is requested

def test_user_schema_deserialization(app):
    """Test schema loading with valid User object data"""
    with app.app_context():
        # Test data matching what your schema actually accepts

        valid_data = {
            "username": "load_test",
            "email": "load@test.com",
            "first_name": "Load",
            "last_name": "Test"
            # Omit password since it is not returned in the data
        }
        
        # Check the data is loaded correctly
        loaded = user_output_schema.load(valid_data, session=db.session)
        assert loaded.username == "load_test"

def test_user_schema_password_handling(app):
    """Test password is handled outside of the user schema in order to never be displayed as part of request"""
    with app.app_context():
        # Create user directly to test password
        skill = SkillLevel(
            id = 1,
            level = "Beginner",
            description = "testdescription"
        )
        db.session.add(skill)
        db.session.commit()
        user = User(
            username="serial_test",
            email="serial@test.com",
            first_name="Serial",
            skill_level_id=skill.id,
            password="Test123!"  # Will be hashed by model
        )
        db.session.add(user)
        db.session.commit()
        
        # Verify password was hashed by checking for data, and ensuring password string is not in the result
        assert user._password_hash is not None
        assert user._password_hash != "correct123"

def test_user_schema_validation(app):
    """Test schema validation for NOT NULL fields"""
    with app.app_context():
        invalid_data = {
            "email": "invalid@test.com"
            # Missing required username, first_name, etc.
        }
        
        with pytest.raises(ValidationError) as err:
            user_input_schema.load(invalid_data, session=db.session)
        
        assert "username" in str(err.value)  # Should complain about missing username

def test_authentication_token_creation(app):
    """Test that we can create a valid JWT token"""
    with app.app_context():
        # Create SkillLevel and user
        skill = SkillLevel(id=1, level="Beginner", description="test")
        db.session.add(skill)
        db.session.commit()
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestSecurePassword1!",
            "first_name": "Test",
            "skill_level_id": 1
        }
        user = user_input_schema.load(user_data, session=db.session)
        db.session.add(user)
        db.session.commit()
        
        # Test token creation
        auth_header = get_auth_header(app, user)
        
        # Verify the token is properly formatted
        assert "Authorization" in auth_header
        assert auth_header["Authorization"].startswith("Bearer ")
        assert len(auth_header["Authorization"].split(".")) == 3  # JWT has 3 parts
        
        print(f"Created token: {auth_header['Authorization']}")

def test_unauthenticated_access_rejected(client):
    """Test that unauthenticated access to protected endpoints is rejected"""
    # Try to access a protected endpoint without any headers
    response = client.get('/users/profile/') 
    print(f"Unauthenticated response: {response.status_code} - {response.get_json()}")
    
    # Assert unathorized response code
    assert response.status_code == 401 

def test_authenticated_user_access(app, client):
    """Test that authenticated users can access protected endpoints"""
    with app.app_context():
        # Create SkillLevel and user
        skill = SkillLevel(id=1, level="Beginner", description="test")
        db.session.add(skill)
        db.session.commit()
        
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestSecurePassword1!",
            "first_name": "Test",
            "skill_level_id": 1
        }
        user = user_input_schema.load(user_data, session=db.session)
        db.session.add(user)
        db.session.commit()
        
        # Create token and test it
        token = create_access_token(identity=str(user.id), expires_delta=None)
        auth_header = {"Authorization": f"Bearer {token}"}
        
        print(f"User ID: {user.id}")
        print(f"Token: {token}")
        print(f"Auth header: {auth_header}")
    
    # Attempt to access a the secure users/profile endpoint
    response = client.get('/users/profile/', headers=auth_header)
    print(f"Endpoint /users/profile/: {response.status_code}")
    
    # Verify successful response
    assert response.status_code == 200
    print(f"Success! Response: {response.get_json()}")
    
    # Verify the response contains expected user data
    response_data = response.get_json()
    assert response_data["username"] == "testuser"
    assert response_data["email"] == "test@example.com"