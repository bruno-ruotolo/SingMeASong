import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

import recommendationsFactory from "./recommendationsFactory.js";

async function deleteAllData() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
  ]);
};

async function repeatedRecommendationScenario(data: CreateRecommendationData) {
  return await prisma.recommendation.create({ data });
};

async function upVoteAndGetByIdScenario() {
  const recommendationBody = recommendationsFactory.createBody();
  return await prisma.recommendation.create({ data: recommendationBody });
};

async function downVoteScenario(score = 0) {
  const recommendationBody = recommendationsFactory.createBody();
  return await prisma.recommendation.create({ data: { ...recommendationBody, score } });
};

async function getAllRecommendationScenario() {
  for (let i = 0; i <= 15; i++) {
    const recommendationBody = recommendationsFactory.createBody();
    await prisma.recommendation.create({ data: recommendationBody });
  };
};

async function getAmountAndRandomScenario() {
  for (let i = 0; i <= 15; i++) {
    const recommendationBody = recommendationsFactory.createBody();
    const score = Math.floor(Math.random() * 200);
    await prisma.recommendation.create({ data: { ...recommendationBody, score } });
  };
};

const scenarioFactory = {
  deleteAllData,
  upVoteAndGetByIdScenario,
  downVoteScenario,
  getAllRecommendationScenario,
  getAmountAndRandomScenario,
  repeatedRecommendationScenario
};
export default scenarioFactory;