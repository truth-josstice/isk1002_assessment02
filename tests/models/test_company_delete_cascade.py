from init import db

def test_company_deletion_cascades_to_gyms(app):
    """Test that when a company is deleted, its gyms are also deleted"""
    # Import models when the test runs
    from models import Company, Gym
        
    with app.app_context():
        # Create the company, add and commit to test db
        company = Company(name="Cascade Test", website="www.cascade.com")
        db.session.add(company)
        db.session.commit()
        
        # Create the gym, add and commit to test db
        gym = Gym(
            company_id=company.id,
            name="Cascade Gym",
            city="Cascade City",
            street_address="123 Cascade St"
        )
        db.session.add(gym)
        db.session.commit()
        
        # Verify gym exists
        assert Gym.query.count() == 1
        
        # Delete company
        db.session.delete(company)
        db.session.commit()
        
        # Verify gym was also deleted
        assert Gym.query.count() == 0