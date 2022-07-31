import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";
import recommendationsFactory from "../factories/recommendationsFactory.js";
import scenarioFactory from "../factories/scenarioFactory.js";

jest.mock("../../src/repositories/recommendationRepository.js");
jest.clearAllMocks();
jest.resetAllMocks();

describe("Create Recommendation Unit Test Suite", () => {
  it("given a valid recommendation, should call create", async () => {
    const recommendation = recommendationsFactory.createBody();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { });
    jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { });

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.findByName).toHaveBeenCalled();
    expect(recommendationRepository.create).toHaveBeenCalled();
  });

  it("given a repeated recommendation, should call an error", async () => {
    const recommendation = recommendationsFactory.createBody();

    jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => {
      return { id: 1, ...recommendation, score: 0 };
    });

    const promise = recommendationService.insert(recommendation);
    expect(promise).rejects.toEqual(conflictError("Recommendations names must be unique"));
  });
});

describe("Upvote Recommendation Unit Test Suite", () => {
  it("given a valid id, should call updateScore", async () => {
    const recommendation = recommendationsFactory.createBody();
    const ID = 1;

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
      return { id: 1, ...recommendation, score: 0 };
    });

    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { });

    await recommendationService.upvote(ID);
    expect(recommendationRepository.find).toHaveBeenCalled();
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
  });

  it("given a invalid id, should call an error", async () => {
    const ID = 1;

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { });

    const promise = recommendationService.upvote(ID);
    expect(promise).rejects.toEqual(notFoundError());
  });
});

describe("Downvote Recommendation Unit Test Suite", () => {
  it("given a valid id, should call updateScore", async () => {
    const recommendation = recommendationsFactory.createBody();
    const ID = 1;

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
      return { id: 1, ...recommendation, score: 0 };
    });

    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
      return { id: 1, ...recommendation, score: 0 };
    });

    await recommendationService.downvote(ID);
    expect(recommendationRepository.find).toHaveBeenCalled();
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
  });

  it("given a invalid id, should call an error", async () => {
    const ID = 1;

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => { });

    const promise = recommendationService.downvote(ID);
    expect(promise).rejects.toEqual(notFoundError());
  });

  it("given a valid id and a score less then -5, should call updateScore and remove", async () => {
    const recommendation = recommendationsFactory.createBody();
    const ID = 1;

    jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => {
      return { id: ID, ...recommendation, score: 0 };
    });
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {
      return { id: ID, ...recommendation, score: -6 };
    });
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { });

    await recommendationService.downvote(ID);
    expect(recommendationRepository.find).toHaveBeenCalled();
    expect(recommendationRepository.updateScore).toHaveBeenCalled();
    expect(recommendationRepository.remove).toHaveBeenCalled();
  });
});

describe("Get All Recommedations Unit Test Suite", () => {
  it("should call findAll", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { });

    await recommendationService.get();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
  });
});

describe("Get Top Recommedations Unit Test Suite", () => {
  it("should call getAmountByScore", async () => {
    const AMOUNT = 10;
    jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => { });

    await recommendationService.getTop(AMOUNT);
    expect(recommendationRepository.getAmountByScore).toHaveBeenCalled();
  });
});

describe("Get Random Recommedations Unit Test Suite", () => {
  it("should call getAmountByScore findAll with differents percentages and greater than 10", async () => {
    const recommendationArr = scenarioFactory.returnRecommendationArrScenario(10, -5, 50);

    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
      return recommendationArr;
    });

    jest.spyOn(Math, "random").mockImplementationOnce(() => { return 0.8 });

    const recommendation = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
    expect(recommendation).not.toBeNull();
    expect(recommendation).not.toBeUndefined();
  });

  it("should call getAmountByScore findAll with differents percentages and less than or equal 10", async () => {
    const recommendationArr = scenarioFactory.returnRecommendationArrScenario(10, -5, 50);

    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
      return recommendationArr;
    });
    jest.spyOn(Math, "random").mockImplementationOnce(() => { return 0.4 });

    const recommendation = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
    expect(recommendation).not.toBeNull();
    expect(recommendation).not.toBeUndefined();
  });

  it("Don't have recommendations, should throw an error", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { return [] });
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { return [] });

    const promise = recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError());
  });

  it("all recommentions is less or greater than 10, should call findAll", async () => {
    const recommendationArr = scenarioFactory.returnRecommendationArrScenario(10, -5, 50);
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { return [] });
    jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {
      return recommendationArr;
    });

    const recommendation = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toHaveBeenCalled();
    expect(recommendation).not.toBeNull();
    expect(recommendation).not.toBeUndefined();
  });
});

describe("Delete All Recomendation Unit Test Suite", () => {
  it("should call deleteAllRecommendation", async () => {
    jest.spyOn(recommendationRepository, "deleteAllRecommendation")
      .mockImplementationOnce((): any => { });

    await recommendationService.deleteAllRecommendation();

    expect(recommendationRepository.deleteAllRecommendation).toHaveBeenCalled();
  });
});