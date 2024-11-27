const endpointsJson = require("../endpoints.json");''
const topicsJson = require("../db/data/development-data/topics")
const db = require("../db/connection")
const data = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
/* Set up your test imports here */
const request = require("supertest")
const app = require("./../db/app")

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data)
})
afterAll(() => {
  return db.end()
})

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


describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object containing all details of the article with the given ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
          })
        )
      });
  });
});
