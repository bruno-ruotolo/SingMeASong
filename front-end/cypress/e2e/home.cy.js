/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

beforeEach(() => {
  cy.resetRecommendation();
});

describe('Create Recommendation Test Suite ', () => {
  const recommendation = {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=aBkTkxKDduc"
  };

  it('should create recommendation', () => {
    cy.visit(`${URL}/`);
    cy.get('[placeholder*="Name"]').type(recommendation.name);
    cy.get('[placeholder*="https://youtu.be/..."]').type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("recommendation");
    cy.get('#createButtom').click();
    cy.wait('@recommendation');

    cy.contains(`${recommendation.name}`).should('exist');
  });

  it('should not create recommendation', () => {
    cy.visit(`${URL}/`);
    cy.get('[placeholder*="Name"]').type(recommendation.name);

    cy.intercept("POST", "/recommendations").as("recommendation");
    cy.get('#createButtom').click();
    cy.wait('@recommendation');

    cy.contains(`${recommendation.name}`).should('not.exist');
  });
});

describe('Navigate Through Menu Pages', () => {
  const recommendation = {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=aBkTkxKDduc"
  };

  beforeEach(() => {
    cy.createRecommendation(recommendation);
  });

  it('should navigate to top', () => {
    cy.intercept('GET', '/recommendations').as('getRecommendationHome');
    cy.visit(`${URL}/`);
    cy.wait('@getRecommendationHome');

    cy.intercept('GET', '/recommendations/top/10').as('getTopRecommendations');
    cy.contains('Top').click();
    cy.wait('@getTopRecommendations');

    cy.get(`article`).should('have.length.greaterThan', 0);
    cy.get(`article`).should('have.length.lte', 10);

    cy.contains(`${recommendation.name}`).should('exist');

    cy.url().should('equal', `${URL}/top`);
  });

  it('should navigate to random', () => {
    cy.intercept('GET', '/recommendations').as('getRecommendationHome');
    cy.visit(`${URL}/`);
    cy.wait('@getRecommendationHome');

    cy.intercept('GET', '/recommendations/random').as('getRandomRecommendation');
    cy.contains('Random').click();
    cy.wait('@getRandomRecommendation');

    cy.get(`article`).should('have.length', 1);

    cy.contains(`${recommendation.name}`).should('exist');
    cy.url().should('equal', `${URL}/random`);
  });

  it('should navigate to home', () => {
    cy.intercept('GET', '/recommendations').as('getRecommendationHome');
    cy.visit(`${URL}/`);
    cy.wait('@getRecommendationHome');

    cy.contains('Home').click();

    cy.contains(`${recommendation.name}`).should('exist');
    cy.url().should('equal', `${URL}/`);
  });
});