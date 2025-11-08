def test_meal_requires_auth(client):
    res = client.get('/api/meals/')
    assert res.status_code in [401, 422]


def test_add_and_get_meal(client, auth_token):
    headers = {'Authorization': f'Bearer {auth_token}'}
    res = client.post('/api/meals/', json={
        'name': 'Breakfast Burrito',
        'calories': 500,
        'protein': 30,
        'carbs': 40,
        'fat': 20
    }, headers=headers)
    assert res.status_code in [200, 201]

    res = client.get('/api/meals/', headers=headers)
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1
