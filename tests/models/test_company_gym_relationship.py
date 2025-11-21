from init import db

def test_company_gym_relationship(app):
    """Test that a company can have multiple gyms"""
    # Import models when the test is run
    from models import Company, Gym
    
    with app.app_context():
        # Create a company
        company = Company(
            name="Test Company",
            website="www.testcompany.com"
        )

        # Add and commit the company so that it exists for the gym
        db.session.add(company)
        db.session.commit()
        
        # Create gyms belonging to this company
        gyms = [Gym(
            company_id=company.id,
            city="City 1",
            street_address="123 Test St",
            name="Gym 1"
        ),
        Gym(
            company_id=company.id,
            city="City 2",
            street_address="456 Test St",
            name="Gym 2"
        )
        ]

        # Add and commit gyms
        db.session.add_all(gyms)
        db.session.commit()
        
        # Test the forward relationship (gym → company)
        assert gyms[0].company.name == "Test Company"
        assert gyms[1].company.website == "www.testcompany.com"
        
        # Test the backward relationship (company → gyms)
        assert len(company.gym) == 2
        assert company.gym[0].name == "Gym 1"
        assert company.gym[1].name == "Gym 2"

