import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
import pytest

@pytest.fixture
def app():
    app = create_app(testing=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_token(client):
    client.post('/api/auth/register', json={
        'username': 'tester',
        'email': 'tester@example.com',
        'password': 'password123'
    })
    response = client.post('/api/auth/login', json={
        'email': 'tester@example.com',
        'password': 'password123'
    })
    return response.get_json()['access_token']
