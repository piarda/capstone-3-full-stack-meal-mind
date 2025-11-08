def test_get_user_info(client):
    # 1. Register + login
    client.post("/api/auth/register", json={
        "username": "userinfo",
        "email": "info@example.com",
        "password": "password123"
    })
    login_res = client.post("/api/auth/login", json={
        "email": "info@example.com",
        "password": "password123"
    })
    token = login_res.get_json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get user info
    res = client.get("/api/user/me", headers=headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["email"] == "info@example.com"

def test_update_user_goals(client):
    # 1. Register + login
    client.post("/api/auth/register", json={
        "username": "goaluser",
        "email": "goal@example.com",
        "password": "password123"
    })
    login_res = client.post("/api/auth/login", json={
        "email": "goal@example.com",
        "password": "password123"
    })
    token = login_res.get_json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Update goals
    res = client.put("/api/user/goals", json={
        "calorie_goal": 2500,
        "protein_goal": 180,
        "carb_goal": 300,
        "fat_goal": 80
    }, headers=headers)
    assert res.status_code in [200, 204]
