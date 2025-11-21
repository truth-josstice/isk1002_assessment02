from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from init import db
from models import Attempt
from schemas import (
    attempt_output_schema, 
    attempts_output_schema,
    admin_attempts_schema,
    attempt_input_schema
)
from utils import admin_required

attempt_bp = Blueprint("attempt", __name__, url_prefix="/attempts")

@attempt_bp.route('/')
@jwt_required()
def get_user_attempts():
    '''Function to GET all users own attempts from the database'''
    # GET statement: SELECT * FROM attempts WHERE current_user.id == user_id;
    stmt = db.select(Attempt).where(current_user.id == Attempt.user_id)
    attempts = db.session.scalars(stmt).all()

    # Check the user has attempts in the database
    if not attempts:
        return {"message": "No attempt records found."}, 404
    
    # Custom output with custom field and attempts data in JSON format
    return jsonify({
        "username": current_user.username, 
        "attempts": attempts_output_schema.dump(attempts)
        })

@attempt_bp.route('/<int:attempt_id>')
@jwt_required()
def get_a_single_attempt(attempt_id):
    """Function to get a single attempt record from the database"""
    # GET statement: SELECT * FROM attempts WHERE current_user.id == user_id AND id == attempt_id;
    stmt = db.select(Attempt).where(
        (current_user.id == Attempt.user_id) & 
        (attempt_id == Attempt.id)
        )
    attempt = db.session.scalar(stmt)

    # Check attempt exists
    if not attempt:
        return {"message": "No attempt record found."}
    
    # Return the attempt data in JSON format
    return jsonify(attempt_output_schema.dump(attempt))

@attempt_bp.route('/', methods=["POST"])
@jwt_required()
def add_an_attempt():
    """Function to add a single attempt using current_user"""
    # GET JSON body data
    body_data = request.get_json()

    # Create new_attempt using attempt_input_schema
    new_attempt = attempt_input_schema.load(body_data, session=db.session)

    # Assign the current_user.id to attmempt.user_id
    new_attempt.user = current_user

    # Add new attempt and commit to the database
    db.session.add(new_attempt)
    db.session.commit()

    # Return new climb data in JSON format
    return jsonify(attempt_output_schema.dump(new_attempt))

@attempt_bp.route('/all/')
@jwt_required()
@admin_required
def get_all_attempts():
    """Function for admin to view all attempts at once"""
    
    # GET statement: SELECT * FROM attempts;
    stmt = db.select(Attempt)
    attempts = db.session.scalars(stmt).all()

    # Check there are attempts in the database
    if not attempts:
        return {"message": "No attempt records were found."}, 404
    
    # Return all attmepts in JSON format
    return jsonify(admin_attempts_schema.dump(attempts))

@attempt_bp.route('/admin/remove/<int:attempt_id>/', methods=["DELETE"])
@jwt_required()
@admin_required
def remove_an_attempt(attempt_id):
    """Function for admin user to delete a user's attempt upon request"""
    # GET statement: SELECT * FROM attempts WHERE id = attempt_id;
    stmt = db.select(Attempt).where(Attempt.id==attempt_id)
    attempt = db.session.scalar(stmt)

    # Check the attempt exists
    if not attempt:
        return {"message": f"Attempt with id {attempt_id} does not exist."}, 404
    
    # Delete and commit
    db.session.delete(attempt)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Attempt with id {attempt_id} deleted successfully."}, 200