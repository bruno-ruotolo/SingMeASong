import app from "../src/app.js";
import supertest from "supertest";

import scenarioFactory from "./factories/scenarioFactory.js";
import recommendationsFactory from "./factories/recommendationsFactory.js";
import { prisma } from "../src/database.js";

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

    expect(createdRecommendation).not.toBeNull;
    expect(createdRecommendation).not.toBeUndefined;
    expect(status).toBe(201);
  });

  it("given a invalid data body (no youtube link), return 422 and don't persist in database", async () => {
    const recommendationBody = recommendationsFactory.createBody();

    const result = await agent.post("/recommendations").send(recommendationBody.name);
    const status = result.statusCode;

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationBody.name, youtubeLink: recommendationBody.youtubeLink }
    });

    expect(createdRecommendation).toBeNull;
    expect(status).toBe(422);
  });

  it("given a invalid data body (no song name), return 422 and don't persist in database", async () => {
    const recommendationBody = recommendationsFactory.createBody();

    const result = await agent.post("/recommendations").send(recommendationBody.youtubeLink);
    const status = result.statusCode;

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendationBody.name, youtubeLink: recommendationBody.youtubeLink }
    });

    expect(createdRecommendation).toBeNull;
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

    expect(createdRecommendation).toBeNull;
    expect(status).toBe(422);
  });
});

describe("POST /recommendations/:id/upvote SUITE", () => {
  it("given a valid id, return 200 and add a score on database", async () => {
    await scenarioFactory.upVoteScenario();
  });
});