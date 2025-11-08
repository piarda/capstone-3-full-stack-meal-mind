def test_get_suggestions(client, auth_token):
    headers = {'Authorization': f'Bearer {auth_token}'}
    res = client.get('/api/suggestions/', headers=headers)
    assert res.status_code in [200, 201]
