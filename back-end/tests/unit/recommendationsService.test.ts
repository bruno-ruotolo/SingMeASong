import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { conflictError } from "../../src/utils/errorUtils.js";
import recommendationsFactory from "../factories/recommendationsFactory.js";
import scenarioFactory from "../factories/scenarioFactory.js";

beforeEach(async () => {
  await scenarioFactory.deleteAllData();
});

describe("Create Recommendation Unit Test Suite", () => {
  it("given a existing recommendation, return 409", () => {
    const recommendation = recommendationsFactory.createBody();

    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
      id: 1, ...recommendation, score: 0
    });

    const result = recommendationService.insert(recommendation);

    expect(result).rejects.toEqual(conflictError("Recommendations names must be unique"));
  });
});