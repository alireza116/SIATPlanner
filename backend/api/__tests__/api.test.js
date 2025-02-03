const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const express = require("express");
const cors = require("cors");
const routes = require("../routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("API Integration Tests", () => {
  let issueId, swotId, goalId, actionId, relationId;

  // Test Issues
  describe("Issues API", () => {
    const testIssue = {
      title: "Test Issue",
      description: "Test Description",
      createdBy: "Test User",
      status: "Open",
    };

    test("Should create a new issue", async () => {
      const response = await request(app).post("/api/issues").send(testIssue);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(testIssue.title);
      issueId = response.body._id;
    });

    test("Should get all issues", async () => {
      const response = await request(app).get("/api/issues");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a single issue", async () => {
      const response = await request(app).get(`/api/issues/${issueId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(issueId);
    });

    test("Should update an issue", async () => {
      const updates = { title: "Updated Title" };
      const response = await request(app)
        .put(`/api/issues/${issueId}`)
        .send(updates);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updates.title);
    });
  });

  // Test SWOT Entries
  describe("SWOT Entries API", () => {
    const testSwot = {
      type: "Strength",
      description: "Test SWOT Entry",
      createdBy: "Test User",
    };

    test("Should create a new SWOT entry", async () => {
      const response = await request(app)
        .post("/api/swot-entries")
        .send({ ...testSwot, issueId });

      expect(response.status).toBe(201);
      expect(response.body.description).toBe(testSwot.description);
      swotId = response.body._id;
    });

    test("Should get SWOT entries by issue", async () => {
      const response = await request(app).get(
        `/api/swot-entries/issue/${issueId}`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should update a SWOT entry", async () => {
      const updates = { description: "Updated SWOT Entry" };
      const response = await request(app)
        .put(`/api/swot-entries/${swotId}`)
        .send(updates);
      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updates.description);
    });
  });

  // Test Goals
  describe("Goals API", () => {
    const testGoal = {
      description: "Test Goal",
      type: "Short-term",
      createdBy: "Test User",
    };

    test("Should create a new goal", async () => {
      const response = await request(app)
        .post("/api/goals")
        .send({ ...testGoal, issueId });

      expect(response.status).toBe(201);
      expect(response.body.description).toBe(testGoal.description);
      goalId = response.body._id;
    });

    test("Should get goals by issue", async () => {
      const response = await request(app).get(`/api/goals/issue/${issueId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should update a goal", async () => {
      const updates = { description: "Updated Goal" };
      const response = await request(app)
        .put(`/api/goals/${goalId}`)
        .send(updates);
      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updates.description);
    });
  });

  // Test Actions
  describe("Actions API", () => {
    const testAction = {
      title: "Test Action",
      description: "Test Action Description",
      status: "Pending",
      createdBy: "Test User",
    };

    test("Should create a new action", async () => {
      const response = await request(app)
        .post("/api/actions")
        .send({ ...testAction, goalId });

      expect(response.status).toBe(201);
      expect(response.body.description).toBe(testAction.description);
      actionId = response.body._id;
    });

    test("Should get actions by goal", async () => {
      const response = await request(app).get(`/api/actions/goal/${goalId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should update an action", async () => {
      const updates = { description: "Updated Action" };
      const response = await request(app)
        .put(`/api/actions/${actionId}`)
        .send(updates);
      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updates.description);
    });

    test("Should update action details", async () => {
      const detail = "<p>Test action detail with rich text</p>";
      const response = await request(app)
        .put(`/api/actions/${actionId}/detail`)
        .send({ detail });
      expect(response.status).toBe(200);
      expect(response.body.detail).toBe(detail);
    });

    test("Should get action details", async () => {
      const response = await request(app).get(
        `/api/actions/${actionId}/detail`
      );
      expect(response.status).toBe(200);
      expect(response.body.detail).toBeTruthy();
    });
  });

  // Test Action-SWOT Relations
  describe("Action-SWOT Relations API", () => {
    const testRelation = {
      reasoning: "Test Reasoning",
    };

    test("Should create a new relation", async () => {
      const response = await request(app)
        .post("/api/action-swot-relations")
        .send({
          ...testRelation,
          actionId,
          swotId,
        });

      expect(response.status).toBe(201);
      relationId = response.body._id;
    });

    test("Should get relations by action", async () => {
      const response = await request(app).get(
        `/api/action-swot-relations/action/${actionId}`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should update a relation", async () => {
      const updates = { reasoning: "Updated reasoning" };
      const response = await request(app)
        .put(`/api/action-swot-relations/${relationId}`)
        .send(updates);
      expect(response.status).toBe(200);
      expect(response.body.reasoning).toBe(updates.reasoning);
    });
  });

  // Test Deletion (cleanup)
  describe("Deletion Tests", () => {
    test("Should delete relation", async () => {
      const response = await request(app).delete(
        `/api/action-swot-relations/${relationId}`
      );
      expect(response.status).toBe(200);
    });

    test("Should delete action", async () => {
      const response = await request(app).delete(`/api/actions/${actionId}`);
      expect(response.status).toBe(200);
    });

    test("Should delete goal", async () => {
      const response = await request(app).delete(`/api/goals/${goalId}`);
      expect(response.status).toBe(200);
    });

    test("Should delete SWOT entry", async () => {
      const response = await request(app).delete(`/api/swot-entries/${swotId}`);
      expect(response.status).toBe(200);
    });

    test("Should delete issue", async () => {
      const response = await request(app).delete(`/api/issues/${issueId}`);
      expect(response.status).toBe(200);
    });
  });
});
