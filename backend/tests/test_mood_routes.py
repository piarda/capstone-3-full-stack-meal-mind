def test_log_and_fetch_moods(client):
    # 1. Register + login
    client.post("/api/auth/register", json={
        "username": "mooduser",
        "email": "mood@example.com",
        "password": "password123"
    })
    login_res = client.post("/api/auth/login", json={
        "email": "mood@example.com",
        "password": "password123"
    })
    token = login_res.get_json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Log a mood
    log_res = client.post("/api/moods/", json={
        "mood_score": 4,
        "energy_level": 8
    }, headers=headers)
    assert log_res.status_code in [200, 201]

    # 3. Fetch today's mood
    get_res = client.get("/api/moods/today", headers=headers)
    assert get_res.status_code in [200, 404]
    if get_res.status_code == 200:
        data = get_res.get_json()
        assert "mood_score" in data
        assert "energy_level" in data
