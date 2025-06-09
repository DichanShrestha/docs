import axios2 from "axios";
import request from "supertest";
import app from "../http/src/index";

// const axios2 = require("axios");
// const request = require("supertest");
// const app = require("../http/src/index");

const BACKEND_URL = "http://localhost:8080";
const WS_URL = "ws://localhost:8000";

const axios = {
  post: async (...args) => {
    try {
      const response = await axios2.post(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  get: async (...args) => {
    try {
      const response = await axios2.get(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  put: async (...args) => {
    try {
      const response = await axios2.put(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
  delete: async (...args) => {
    try {
      const response = await axios2.delete(...args);
      return response;
    } catch (error) {
      return error.response;
    }
  },
};

describe("Create Docs", () => {
  it("should create a new document and return its ID", async () => {
    const response = await request(app)
      .post(`http://localhost:8080/create-docs`)
      .send({
        name: "Test Document",
        content: "This is a test document",
        collaborators: [
          {
            userId: "1234567890",
          },
        ],
      });
    console.log(response);
    expect(response.data.status).toBe(201);
    expect(response.data).toHaveProperty("_id");
    expect(response.data._id).toBeDefined();
  });
});

describe("Generate Link", () => {
  it("should return a link when valid docsId is sent", async () => {
    const response = await axios.post(`${BACKEND_URL}/generate-link`, {
      docsId: "fibewfb121acd",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("link");
    expect(response.data.link).toBeDefined();
  });
});

describe("Accept Invite", () => {
  it("should accept the invite and return a success message", async () => {
    const response = await axios.post(`${BACKEND_URL}/accept-invite`, {
      inviteId: "1234567890",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("collaborators");
    expect(Array.isArray(response.data.collaborators)).toBe(true);

    response.data.collaborators.forEach((collaborator) => {
      expect(collaborator).toHaveProperty("userId");
      expect(collaborator.userId).toBeDefined();
    });
  });
});
