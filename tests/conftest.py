import pytest
import os
from sqlalchemy import text

from main import create_app
from init import db
from schemas import user_input_schema
from flask_jwt_extended import create_access_token


@pytest.fixture(scope='function')
def app():
    """
    Pytest fixture to create and configure a Flask app for testing.
    Returns: Flask app configured for SQLite in memory database with foreign keys enabled
    """

    # Define testing settings
    test_config = {
        'TESTING': True, # Enable testing mode
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:?foreign_keys=1', # Use in-memory and enable foreign keys
        'JWT_SECRET_KEY': 'test-secret-key' # Test secret key 
    }

    # Initialise test app
    app = create_app(test_config=test_config)

    # Set up app context for database operations
    with app.app_context():
        # Enable foreign key constraints for SQLite
        if 'sqlite' in db.engine.url.drivername:
            with db.engine.connect() as conn:
                # Execute PRAGMA statement as SQLite does not support natively enabled foreign_key constraints
                conn.execute(text('PRAGMA foreign_keys=ON'))
                conn.commit()  # Commit the pragma statement
        # Create all tables and yield an istance of the app
        db.create_all()
        yield app

        # Remove the session data from the test and drop all tables
        db.session.remove()
        db.drop_all()

@pytest.fixture
def runner(app):
    """Fixture for testing CLI commands"""
    from flask.testing import CliRunner
    return app.test_cli_runner()

@pytest.fixture
def client(app):
    """Fixture for testing HTTP requests"""
    
    # Set up app context for HTTP requests
    with app.app_context():
        #Crete and yield test client instance
        client = app.test_client()
        yield client

        # At the end of the rollback all database changes
        db.session.rollback()

def get_auth_header(app, user):
    """Generate an Authorization header with access token for a user."""
    
    # Set up app context for acces token creation
    with app.app_context():
        # Create access token using mock secret_key
        token = create_access_token(identity=user.id, expires_delta=None)
        
        # Return bearer token in response
        return {"Authorization": f"Bearer {token}"}