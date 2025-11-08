def test_register_and_login(client):
    res = client.post('/api/auth/register', json={
        'username': 'user1',
        'email': 'user1@example.com',
        'password': 'pass123'
    })
    assert res.status_code in [200, 201]

    res = client.post('/api/auth/login', json={
        'email': 'user1@example.com',
        'password': 'pass123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'access_token' in data
    assert data['email'] == 'user1@example.com'


def test_login_fails_with_wrong_password(client):
    client.post('/api/auth/register', json={
        'username': 'wrongpw',
        'email': 'wrongpw@example.com',
        'password': 'correct'
    })
    res = client.post('/api/auth/login', json={
        'email': 'wrongpw@example.com',
        'password': 'incorrect'
    })
    assert res.status_code in [400, 401]
