import { faker } from "@faker-js/faker";
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

async function getAmountAndRandomScenario(QUANTITY: number, MAX_SCORE: number) {
  const recommendationArr = [];
  for (let i = 0; i <= QUANTITY; i++) {
    const recommendationBody = recommendationsFactory.createBody();
    const score = Math.floor(Math.random() * MAX_SCORE);
    recommendationArr.push({ ...recommendationBody, score });
  };
  await prisma.recommendation.createMany({ data: recommendationArr });
};

function returnRecommendationArrScenario(ARRAY_SIZE: number, MIN_VALUE: number, MAX_VALUE: number) {
  const recommendationArr = [];
  for (let i = 0; i <= ARRAY_SIZE; i++) {
    recommendationArr.push(
      {
        id: faker.datatype.number({ min: 1, max: ARRAY_SIZE }),
        name: faker.music.songName(),
        youtubeLink: "https://www.youtube.com/watch?v=aBkTkxKDduc",
        score: faker.datatype.number({ min: MIN_VALUE, max: MAX_VALUE })
      }
    );
  };
  return recommendationArr;
};

const scenarioFactory = {
  deleteAllData,
  upVoteAndGetByIdScenario,
  downVoteScenario,
  getAllRecommendationScenario,
  getAmountAndRandomScenario,
  repeatedRecommendationScenario,
  returnRecommendationArrScenario
};
export default scenarioFactory;