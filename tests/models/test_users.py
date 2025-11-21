from init import db

from models import User, SkillLevel

def test_user_creation(app):
    """Test we can create a user based on the user model"""
    
    # Create skill level for foreign key constraint
    with app.app_context():
        skill = SkillLevel(
            id = 4,
            level = "Beginner",
            description = "testdescription"
        )

        # Commit skill to database so that it exists for user creation
        db.session.add(skill)
        db.session.commit()

        # Create user with necessary foreign key data
        user = User(
            username="simpleuser",
            email="simple@test.com",
            first_name="Simple",
            skill_level_id=skill.id,
            password="Test123!"  # Will be hashed by model
        )

        # Assert user data exists and is correct
        assert user.username == "simpleuser"
        assert user.email == "simple@test.com"
        assert user.first_name == "Simple"
        assert user.skill_level_id == 4

        # Assert password is hashed correctly
        assert "Test123!" not in user._password_hash