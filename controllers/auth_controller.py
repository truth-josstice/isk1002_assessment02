from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, current_user
from datetime import timedelta

from init import db
from models import User
from schemas import (
    user_output_schema, 
    user_input_schema
)

auth_bp = Blueprint("auth", __name__, url_prefix="/")

@auth_bp.route('/login', methods=["POST"])
def user_login():
    """
    Authenticates a user and returns a JWT access token.

    The client should:
    1. Store the current user token
    2. Use the authorization token for all protected requests
    """
    
    # Get login credentials from JSON body data
    body_data = request.get_json()

    # Check that the body data exists and has both the required fields "username" and "password"
    if not body_data or "username" not in body_data or "password" not in body_data:
        return {"message": "Username and password are required"}, 400
    
    # Find user by username
    stmt = db.select(User).filter_by(username=body_data["username"])
    user = db.session.scalar(stmt)

    # IF the user or password are not correct, send a message
    if not user or not user.check_password(body_data["password"]):
        return {"message": "Invalid username or password"}, 401
    
    # Create an access token for the user, sets it to logout automatically after 15 minutes
    token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(minutes=15)
    )
    
    # Return the token in JSON response
    return jsonify({
        "Authentication Bearer token": token,
    })

@auth_bp.route('/register', methods=["POST"])
def register_user():
    # GET JSON body data
    body_data = request.get_json()

    # Create new user using schema
    new_user = user_input_schema.load(body_data, session=db.session)

    # Check if user with email already exists
    stmt = db.select(User).where(User.email==new_user.email)
    if db.session.scalar(stmt):
        return {"message": "An account with this email already exists, please login or enter a different email."}, 409
    
    # Check if user with username already exists
    stmt = db.select(User).where(User.username==new_user.username)
    if db.session.scalar(stmt):
        return {"message": f"An account with the username {new_user.username} already exists. Please choose a different username."}, 409
    
    # Add the new user and commit to the database
    db.session.add(new_user)
    db.session.commit()

    # Automatically create access token for "logged in" status for new user
    access_token = create_access_token(identity=new_user.id)

    # Custom confirmation message with access token and user data in JSON format
    return {
        "message": "User created successfully.",
        "access_token": access_token,
        "user": user_output_schema.dump(new_user)
        }, 201

@auth_bp.route('/logout')
@jwt_required()
def user_logout():
    """
    Logout endpoint.
    Note: The access tokens in this app have a short lifespan of 15 minutes.
    At this stage of development I don't have refresh tokens so nothing is blacklisted.
    Future development would include refresh tokens and blacklist them on logout.
    """
    return {"message": "Successfully logged out, access token will expire shortly."}, 200

@auth_bp.route('/delete', methods=["DELETE"])
@jwt_required()
def user_delete_profile():
    """Function for user to delete their own profile"""
    # GET statement: SELECT * FROM users WHERE id = current_user.id;
    stmt = db.select(User).where(User.id == current_user.id)
    user = db.session.scalar(stmt)

    # User MUST exist due to JWT token requirement
    # Delete user from database 
    db.session.delete(user)
    db.session.commit()

    # Custom confirmation message
    return {"message": "Your user account and all associated data has been deleted. Please join us again sometime."},201