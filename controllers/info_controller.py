from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils import admin_required

from init import db

from models import SkillLevel, Style
from schemas import (
    skill_level_schema,
    skill_levels_schema, 
    style_schema,
    styles_schema)

info_bp = Blueprint('info', __name__, url_prefix="/learn")

@info_bp.route('/styles/')
def get_styles():
    """Retrieves all style records from the styles table and displays to visitor"""
    # GET statement: SELECT * FROM skill_levels;
    stmt = db.select(Style)
    styles = db.session.scalars(stmt)

    # Check that styles exist
    if not styles:
        return {"message": "No styles found"}, 404
    
    # Returns style table data in JSON format
    return jsonify(styles_schema.dump(styles))

@info_bp.route('/skills/')
def get_skill_levels():
    """Retreives all skill level records from the skill_levels table and displays to visitor"""
    # Get statement: SELECT * FROM skill_levels;
    stmt = db.select(SkillLevel)
    skills = db.session.scalars(stmt)

    # Check skills exist
    if not skills:
        return {"message": "No skills found"}, 404
    
    # Returns skill table data in JSON format
    return jsonify(skill_levels_schema.dump(skills))

@info_bp.route('/styles/', methods = ["POST"])
@jwt_required()
@admin_required
def add_style():
    """Function to add a single style record for admin"""
    # GET JSON body data
    body_data = request.get_json()

    # Create style record using style_schema
    new_style = style_schema.load(body_data, session=db.session)

    # Add and commit new style to database
    db.session.add(new_style)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Style {new_style.name} added successfully"}, 201


@info_bp.route('/skills/', methods = ["POST"])
@jwt_required()
@admin_required
def add_skill():
    """Function to add a single skill record for admin"""
    # GET JSON body data
    body_data = request.get_json()

    # Create style record using style_schema
    new_skill = skill_level_schema.load(body_data, session=db.session)

    # Add and commit new skill to database
    db.session.add(new_skill)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Style {new_skill.level} added successfully"}, 201

@info_bp.route('/styles/<int:style_id>/', methods=["DELETE"])
@jwt_required()
@admin_required
def remove_style(style_id):
    """Function to remove a single style record for admin"""
    # GET statement: SELECT * FROM styles WHERE id = style_id;
    stmt = db.select(Style).where(Style.id==style_id)
    style = db.session.scalar(stmt)

    # Check style record exists
    if not style:
        return {"message": f"Style with id {style_id} does not exist"}, 404
    
    # Delete and commit
    db.session.delete(style)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Style with id {style_id} deleted successfully"}, 200

@info_bp.route('/skills/<int:skill_level_id>/', methods=["DELETE"])
@jwt_required()
@admin_required
def remove_skill(skill_level_id):
    """Function to remove a single skill record for admin"""
    # GET statement: SELECT * FROM skills WHERE id = skill_id;
    stmt = db.select(SkillLevel).where(SkillLevel.id==skill_level_id)
    skill = db.session.scalar(stmt)

    # Check skill record exists
    if not skill:
        return {"message": f"Skill level with id {skill_level_id} does not exist"}, 404
    
    # Delete and commit
    db.session.delete(skill)
    db.session.commit()

    # Custom confirmation message
    return {"message": f"Skill level with id {skill_level_id} deleted successfully"}, 200

@info_bp.route('/styles/<int:style_id>/', methods=["PUT", "PATCH"])
@jwt_required()
@admin_required
def update_style(style_id):
    """Function to update a single style record for admin"""
    # GET statement: SELECT * FROM styles WHERE id = style_id;
    stmt = db.select(Style).where(Style.id==style_id)
    style = db.session.scalar(stmt)

    # Check style record exists
    if not style:
        return {"message": f"Style with id {style_id} does not exist"}, 404
    
    # GET JSON body data
    body_data = request.get_json()

    # Update selected style
    updated_style = style_schema.load(
        body_data,
        instance=style,
        session=db.session,
        partial=True
    )

    db.session.add(updated_style)
    db.session.commit()

    return {
        "message": f"Style with id {style_id} updated successfully",
        "details": jsonify(style_schema.dump(updated_style))
        }, 200

@info_bp.route('/skills/<int:skill_level_id>/', methods=["PUT", "PATCH"])
@jwt_required()
@admin_required
def update_skill(skill_level_id):
    """Function to update a single skill record for admin"""
    # GET statement: SELECT * FROM skills WHERE id = skill_id;
    stmt = db.select(SkillLevel).where(SkillLevel.id==skill_level_id)
    skill = db.session.scalar(stmt)

    # Check skill record exists
    if not skill:
        return {"message": f"Skill level with id {skill_level_id} does not exist"}, 404
    
     # GET JSON body data
    body_data = request.get_json()

    # Update selected skill
    updated_skill = skill_level_schema.load(
        body_data,
        instance=skill,
        session=db.session,
        partial=True
    )

    # Add updated skill and commit changes to database
    db.session.add(updated_skill)
    db.session.commit()

    # Custom confirmation message
    return {
        "message": f"Skill level with id {skill_level_id} updated successfully",
        "details": jsonify(skill_level_schema.dump(updated_skill))
        }, 200

@info_bp.route('/about-api/')
def api_info():
    """Returns API4 information"""
    return {
        "message": "Climbing Tracker API",
        "version": "1.0",
        "assessment": "DEV1002 - Assessment 03",
        "documentation": "See API DOCUMENTATION.md for endpoint details"
    }