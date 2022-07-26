import app from "../../src/app.js";
import supertest from "supertest";

import scenarioFactory from "../factories/scenarioFactory.js";
import recommendationsFactory from "../factories/recommendationsFactory.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
  await scenarioFactory.deleteAllData();
});

const agent = supertest(app);

describe("POST /recommendations Suite", () => {
  it("given a valid data body, return 201 and persist in database", async () => {
    const recommendationBody = recommendationsFactory.createBody();

    const result = await agent.post("/recommendations").send(recommendationBody);
    const status = result.statusCode;

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationBody.name, youtubeLink: recommendationBody.youtubeLink }
    });

    expect(createdRecommendation).not.toBeNull();
    expect(createdRecommendation).not.toBeUndefined();
    expect(status).toBe(201);
  });

  it("given a invalid data body (no youtube link), return 422 and don't persist in database", async () => {
    const recommendationBody = recommendationsFactory.createBody();

    const result = await agent.post("/recommendations").send(recommendationBody.name);
    const status = result.statusCode;

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationBody.name, youtubeLink: recommendationBody.youtubeLink }
    });

    expect(createdRecommendation).toBeNull();
    expect(status).toBe(422);
  });

  it("given a invalid data body (no song name), return 422 and don't persist in database", async () => {
    const recommendationBody = recommendationsFactory.createBody();

    const result = await agent.post("/recommendations").send(recommendationBody.youtubeLink);
    const status = result.statusCode;

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationBody.name, youtubeLink: recommendationBody.youtubeLink }
    });

    expect(createdRecommendation).toBeNull();
    expect(status).toBe(422);
  });

  it("given a invalid youtube link, return 422 and don't persist in database", async () => {
    const recommendationBody = recommendationsFactory.createBody();

    const result = await agent.post("/recommendations").send(
      { ...recommendationsFactory, youtubeLink: "https://musescore.com/torbybrand/sweden-minecraft" });
    const status = result.statusCode;

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationBody.name, youtubeLink: recommendationBody.youtubeLink }
    });

    expect(createdRecommendation).toBeNull();
    expect(status).toBe(422);
  });
});

describe("POST /recommendations/:id/upvote SUITE", () => {
  it("given a valid id, return 200 and add a score on database", async () => {
    const recommendation = await scenarioFactory.upVoteAndGetByIdScenario();
    const { id } = recommendation;

    const result = await agent.post(`/recommendations/${id}/upvote`);
    const status = result.statusCode;

    const createdUpVote = await prisma.recommendation.findUnique({ where: { id } });

    expect(createdUpVote.score).toBeGreaterThan(0);
    expect(status).toBe(200);
  });

  it("given a invalid id, return 404", async () => {
    const id = Math.floor(Math.random() * 100);

    const result = await agent.get(`/recommendations/${id}/upvote`);
    const status = result.statusCode;

    expect(status).toBe(404);
  });
});

describe("POST /recommendations/:id/downvote SUITE", () => {
  it("given a valid id, return 200 and remove a score on database", async () => {
    const recommendation = await scenarioFactory.downVoteScenario();
    const { id } = recommendation;

    const result = await agent.post(`/recommendations/${id}/downvote`);
    const status = result.statusCode;

    const createdUpVote = await prisma.recommendation.findUnique({ where: { id } });

    expect(createdUpVote.score).toBeLessThan(0);
    expect(status).toBe(200);
  });

  it("given a invalid id, return 404", async () => {
    const id = Math.floor(Math.random() * 100);

    const result = await agent.get(`/recommendations/${id}/downvote`);
    const status = result.statusCode;

    expect(status).toBe(404);
  });

  it("given a valid id and score less than -5, return 200 and remove recommendation", async () => {
    const recommendation = await scenarioFactory.downVoteScenario(-5);
    const { id } = recommendation;

    const result = await agent.post(`/recommendations/${id}/downvote`);
    const status = result.statusCode;

    const createdUpVote = await prisma.recommendation.findUnique({ where: { id } });

    expect(createdUpVote).toBeNull();
    expect(status).toBe(200);
  });
});

describe("GET /recommendations", () => {
  it("if quantity more than 10, return 200 and the last 10 recommendations", async () => {
    const RECOMMENDATION_QUANTITY = 20;
    const MAX_SCORE = 200;
    await scenarioFactory.createSeveralRecommendationsScenario(RECOMMENDATION_QUANTITY, MAX_SCORE);

    const result = await agent.get(`/recommendations`);
    const status = result.statusCode;

    expect(result.body).toHaveLength(10);
    expect(result.body[0].id).toBeTruthy();
    expect(result.body[0].name).toBeTruthy();
    expect(result.body[0].youtubeLink).toBeTruthy();
    expect(result.body[0].score).toBeTruthy();
    expect(status).toBe(200);
  });

  it("if quantity less than 10, return 200 and the last {QUANTITY} recommendations", async () => {
    const RECOMMENDATION_QUANTITY = 5;
    const MAX_SCORE = 200;
    await scenarioFactory.createSeveralRecommendationsScenario(RECOMMENDATION_QUANTITY, MAX_SCORE);

    const result = await agent.get(`/recommendations`);
    const status = result.statusCode;

    expect(result.body).toHaveLength(RECOMMENDATION_QUANTITY);
    expect(result.body[0].id).toBeTruthy();
    expect(result.body[0].name).toBeTruthy();
    expect(result.body[0].youtubeLink).toBeTruthy();
    expect(result.body[0].score).toBeTruthy();
    expect(status).toBe(200);
  });
});

describe("GET /recommendations/:id", () => {
  it("given a valid id, return 200 and the recommendation", async () => {
    const recommendation = await scenarioFactory.upVoteAndGetByIdScenario();
    const { id } = recommendation;

    const result = await agent.get(`/recommendations/${id}`);
    const status = result.statusCode;

    expect(result.body.id).toBe(recommendation.id);
    expect(result.body.name).toBe(recommendation.name);
    expect(result.body.youtubeLink).toBe(recommendation.youtubeLink);
    expect(result.body.score).toBe(recommendation.score);
    expect(status).toBe(200);
  });

  it("given a invalid id, return 404", async () => {
    const id = Math.floor(Math.random() * 100);

    const result = await agent.get(`/recommendations/${id}`);
    const status = result.statusCode;

    expect(result).toBeNull;
    expect(status).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("return 200 and a object", async () => {
    const RECOMMENDATION_QUANTITY = 15;
    const MAX_SCORE = 200;
    await scenarioFactory.createSeveralRecommendationsScenario(RECOMMENDATION_QUANTITY, MAX_SCORE);

    const result = await agent.get(`/recommendations/random`);
    const status = result.statusCode;

    expect(result).not.toBeNull();
    expect(result.body.id).toBeTruthy();
    expect(result.body.name).toBeTruthy();
    expect(result.body.youtubeLink).toBeTruthy();
    expect(result.body.score).toBeTruthy();
    expect(status).toBe(200);
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("if AMOUNT < RECOMMENDATION_QUANTITY, return 200 and the top {amount} recommendations", async () => {
    const AMOUNT = 5;
    const RECOMMENDATION_QUANTITY = 15;
    const MAX_SCORE = 200;
    await scenarioFactory.createSeveralRecommendationsScenario(RECOMMENDATION_QUANTITY, MAX_SCORE);

    const result = await agent.get(`/recommendations/top/${AMOUNT}`);
    const status = result.statusCode;

    expect(result.body).toHaveLength(AMOUNT);
    expect(result.body[0].id).toBeTruthy();
    expect(result.body[0].name).toBeTruthy();
    expect(result.body[0].youtubeLink).toBeTruthy();
    expect(result.body[0].score).toBeTruthy();
    expect(result.body[0].score).toBeGreaterThanOrEqual(result.body[1].score);
    expect(result.body[1].score).toBeGreaterThanOrEqual(result.body[2].score);
    expect(status).toBe(200);
  });

  it("if AMOUNT > RECOMMENDATION_QUANTITY, return 200 and the top {RECOMMENDATION_QUANTITY}", async () => {
    const AMOUNT = 10;
    const RECOMMENDATION_QUANTITY = 5;
    const MAX_SCORE = 200;
    await scenarioFactory.createSeveralRecommendationsScenario(RECOMMENDATION_QUANTITY, MAX_SCORE);

    const result = await agent.get(`/recommendations/top/${AMOUNT}`);
    const status = result.statusCode;

    expect(result.body).toHaveLength(RECOMMENDATION_QUANTITY);
    expect(result.body[0].id).toBeTruthy();
    expect(result.body[0].name).toBeTruthy();
    expect(result.body[0].youtubeLink).toBeTruthy();
    expect(result.body[0].score).toBeTruthy();
    expect(result.body[0].score).toBeGreaterThanOrEqual(result.body[1].score);
    expect(result.body[1].score).toBeGreaterThanOrEqual(result.body[2].score);
    expect(status).toBe(200);
  });
});