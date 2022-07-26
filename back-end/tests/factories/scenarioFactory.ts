import { prisma } from "../../src/database.js";

import recommendationsFactory from "./recommendationsFactory.js";

async function deleteAllData() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations`,
  ]);
};

async function upVoteScenario() {
  const recommendationBody = recommendationsFactory.createBody();
  return await prisma.recommendation.create({ data: recommendationBody });
};

const scenarioFactory = {
  deleteAllData,
  upVoteScenario
};

export default scenarioFactory;