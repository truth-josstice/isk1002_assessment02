from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user

from init import db
from models import User
from schemas import (
    user_output_schema, 
    users_output_schema,
    user_input_schema
)
from utils import admin_required

user_bp = Blueprint("user", __name__, url_prefix="/users")

@user_bp.route('/')
@jwt_required()
@admin_required
def get_users():
    '''Function to GET multiple users from the database for admin users'''

    # GET statement: SELECT * FROM users;
    stmt = db.select(User)
    users = db.session.scalars(stmt).all()

    # Check the user exists
    if not users:
        return {"message": "No user records found."}, 404
    
    # Return all user data in JSON format
    return jsonify(users_output_schema.dump(users))
    
@user_bp.route('/profile/')
@jwt_required()
def get_user_profile():
    """Function to GET user profile using authorisation token"""
    # JWT checks for user identity, JSON format of user data returned
    return jsonify(user_output_schema.dump(current_user))

@user_bp.route('/update-profile/', methods=["PUT", "PATCH"])
@jwt_required()
def update_user_profile():
    """Function to PUT/PATCH users own profile"""
    # GET statement: SELECT * FROM users WHERE id = id;
    stmt = db.select(User).where(User.id == current_user.id)
    user = db.session.scalar(stmt)

    # User must exist so can skip any if loops
    # GET JSON body data
    body_data = request.get_json()

    # Load data into user via user_input_schema
    updated_user = user_input_schema.load(
        body_data, 
        session = db.session,
        instance = user,
        partial = True
        )
    
    # Add and commit to database
    db.session.add(updated_user)
    db.session.commit()

    # Custom display of updated user profile
    return {
        "message": "User updated successfully.",
        "details": jsonify(user_output_schema.dump(updated_user))
    }, 200

@user_bp.route('/', methods=["POST"])
@jwt_required()
@admin_required
def add_new_user():
    """Function to POST a new user for admin"""
    # GET JSON body data
    body_data = request.get_json()

    # Create user from body data
    new_user = user_input_schema.load(body_data, session=db.session)

    # Check if user with email already exists
    stmt = db.select(User).where(User.email==new_user.email)
    if db.session.scalar(stmt):
        return {"message": "An account with this email already exists, please login or enter a different email."}, 409
    
    # Check if user with username already exists
    stmt = db.select(User).where(User.username==new_user.username)
    if db.session.scalar(stmt):
        return {"message": f"An account with the username {new_user.username} already exists. Please choose a different username."}, 409
    
    # Add and commit new user to the database
    db.session.add(new_user)
    db.session.commit()

    # Return the new user data in JSON format
    return jsonify(user_output_schema.dump(new_user)), 201

@user_bp.route('/<int:user_id>/', methods=["DELETE"])
@jwt_required()
@admin_required
def delete_user(user_id):
    """Function to DELETE any user for admin"""
    # GET statement: SELECT * FROM users WHERE id = user_id;
    stmt = db.select(User).where(User.id == user_id)
    user = db.session.scalar(stmt)

    # Check if user exists
    if not user:
        return {"message": f"User with id {user_id} does not exist."}, 404
    
    # Delete and commit 
    db.session.delete(user)
    db.session.commit()

    # Return confirmation message
    return {"message": f"User with id {user_id} deleted successfully."}, 200

@user_bp.route('/admin/<int:user_id>/grant/', methods=["PATCH"])
@jwt_required()
@admin_required
def make_user_admin(user_id):
    """Function to make user an admin user"""
    # GET statement: SELECT * FROM users WHERE id = id;
    stmt = db.select(User).where(User.id == user_id)
    user = db.session.scalar(stmt)

    # Check user exists
    if not user:
        return {"message": f"User with id {user_id} does not exist."}, 404
    
    # Manually define is_admin boolean to True and commit
    user.is_admin = True
    db.session.commit()

    # Custom confirmation message and user information returned
    return {
        "message": f"User {user.username} has been granted admin privileges.",
        "details": jsonify(user_output_schema.dump(user))
    }, 200

@user_bp.route('/admin/<int:user_id>/revoke/', methods=["PATCH"])
@jwt_required()
@admin_required
def revoke_user_admin(user_id):
    """Function to revoke user admin privileges"""
    # GET statement: SELECT * FROM users WHERE id = id;
    stmt = db.select(User).where(User.id == user_id)
    user = db.session.scalar(stmt)

    # Check user exists
    if not user:
        return {"message": f"User with id {user_id} does not exist."}, 404
    
    # Manually define is_admin boolean to False and commit
    user.is_admin = False
    db.session.commit()

    # Custom confirmation mesasge and user information returned
    return {
        "message": f"User {user.username}'s admin privileges have been revoked.",
        "details": jsonify(user_output_schema.dump(user))
    }, 200