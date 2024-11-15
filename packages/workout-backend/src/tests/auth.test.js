const request = require("supertest");
const app = require("../server");

describe("Authentication Tests", () => {
  const testUser = {
    username: "testuser" + Date.now(),
    pwd: "Test123!",
  };
  let authToken;

  describe("Registration Tests", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/signup").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      authToken = res.body.token;
    });

    it("should not allow duplicate username", async () => {
      const res = await request(app).post("/signup").send(testUser);

      expect(res.status).toBe(409);
      expect(res.text).toBe("Username already taken");
    });

    it("should require username and password", async () => {
      const res = await request(app).post("/signup").send({});

      expect(res.status).toBe(400);
      expect(res.text).toBe("Bad request: Invalid input data.");
    });
  });

  describe("Login Tests", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/login").send(testUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      authToken = res.body.token;
    });

    it("should fail with wrong password", async () => {
      const res = await request(app).post("/login").send({
        username: testUser.username,
        pwd: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.text).toBe("Unauthorized");
    });

    it("should fail with non-existent user", async () => {
      const res = await request(app).post("/login").send({
        username: "nonexistentuser",
        pwd: "Test123!",
      });

      expect(res.status).toBe(401);
      expect(res.text).toBe("Unauthorized");
    });
  });

  describe("Protected Route Tests", () => {
    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Test User" });

      expect(res.status).toBe(201);
    });

    it("should reject access without token", async () => {
      const res = await request(app).post("/users");

      expect(res.status).toBe(401);
    });

    it("should reject access with invalid token", async () => {
      const res = await request(app)
        .post("/users")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });
  });
});
