/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

describe('Create Recommendation Test Suite ', () => {
  const recommendation = {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=aBkTkxKDduc"
  };

  beforeEach(() => {
    cy.resetRecommendation();
    cy.createRecommendation(recommendation);
  });

  it("should increase upvote number on click", () => {
    cy.visit(`${URL}/`);

    cy.get('#upvote').click();

    cy.get('#score').should('contain', `1`);
  });

  it("should increase downvote number on click", () => {
    cy.visit(`${URL}/`);

    cy.get('#downvote').click();

    cy.get('#score').should('contain', `-1`);
  });

  it("should increase downvote number to -5 and disappear", () => {
    cy.visit(`${URL}/`);

    for (let i = 0; i <= 5; i++) {
      cy.get('#downvote').click();
    };

    cy.get('#player').should('not.exist');
  });
});