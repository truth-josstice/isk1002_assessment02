def test_company_creation(app):
    """Test we can create a company based on the company model"""
    # Import the company model when the test is run
    from models import Company

    # Create a company
    with app.app_context():
        company = Company(
            name="simplecompany",
            website="http://www.company.com",
            )
        
        # Assert company exists and values are correct
        assert company.name == "simplecompany"
        assert company.website == "http://www.company.com"