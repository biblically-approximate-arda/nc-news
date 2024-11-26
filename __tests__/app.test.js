const endpointsJson = require("../endpoints.json");''
const topicsJson = require("../db/data/development-data/topics")
/* Set up your test imports here */
const request = require("supertest")
const app = require("./../db/app")

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each with a slug and a description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual(topicsJson);
      });
  });
});
