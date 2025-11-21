import re
from marshmallow import ValidationError

def validate_password_complexity(password):
    """
    Regex validation for passwords, ensuring complexity to secure standards
    """
    # Ensures all users know what passwords must contain
    password_requirement = "Password be at least 8 letter and contain at least: one uppercase letter, one number and one special character."
    
    # If password is less than 8 characters it does not meet requirement
    if len(password) < 8:
        raise ValidationError(password_requirement)
    
    # IF the password does not contain an uppercase character it does not meet requirement
    if not re.search(r'[A-Z]', password):
        raise ValidationError(password_requirement)
    
    # IF the password does not contain a number it does not meet the requirement
    if not re.search(r'[0-9]', password):
        raise ValidationError(password_requirement)
    
    # IF the password does not contain a special character it does not meet the requirement
    if not re.search(r'[!@#$%^&*()":{}|<>]', password):
        raise ValidationError(password_requirement)