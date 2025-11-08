def test_get_foods(client):
    # Step 1: Register and login a user
    register_res = client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    assert register_res.status_code in [200, 201]

    login_res = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert login_res.status_code == 200
    token = login_res.get_json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Create a meal for this user
    meal_res = client.post("/api/meals/", json={
        "name": "Breakfast",
        "calories": 500,
        "protein": 25,
        "carbs": 50,
        "fat": 20
    }, headers=headers)
    assert meal_res.status_code in [200, 201]
    meal_id = meal_res.get_json().get("id")

    # Step 3: Add a food item to that meal
    food_res = client.post(f"/api/foods/{meal_id}", json={
        "name": "Eggs",
        "calories": 150,
        "protein": 12,
        "carbs": 1,
        "fat": 10
    }, headers=headers)
    assert food_res.status_code in [200, 201]

    # Step 4: Get foods for that meal
    res = client.get(f"/api/foods/{meal_id}", headers=headers)
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Eggs"
