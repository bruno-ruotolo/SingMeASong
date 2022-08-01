<br />
<div align="center">
    <img src="./.github/SingMeASong.png" alt="Sing Me A Song Logo" width="150">
    <h3 align="center">Sing Me A Song</h3>
    <p> A Test Aimed Project
</div>

# About

Testing can be tedious at times, but it is one of the most important points of a project. Ensuring that your application is functional is extremely important. 
This project is focused on back-end testing (integration and unit tests) and end-2-end testing of a communitary songs collection. Let's test 🧪.


## Technologies
These are the main tools, frameworks and languages that were used in this project:<br>

<div>
  <img style='margin: 5px;' src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/typescript-%233178C6.svg?&style=for-the-badge&logo=typescript&logoColor=white" />
  <img style='margin: 5px;' src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/postgresql-%23336791.svg?&style=for-the-badge&logo=postgresql&logoColor=white" />
  <img style='margin: 5px;' src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e"/>
</div>

## How to Run

First you need to clone the this repository. Run the following command:

```git
git clone https://github.com/bruno-ruotolo/SingMeASong
```

Then, navigate to the front-end folder and run the following command:

```git
npm i
```

Also navigate to the back-end folder and run the same command:

```git
npm i
```

You must to create a `.env` and `.env.test`, using the `.envExample` as example.

Use the Prisma Migrations to create your main database:

```git
npx prisma migrate dev
```

Finally, you're able to run the tests.

# Tests Reference
Here you can check the tests related to the project and how to run it. Have Fun 😄

## Back-End Tests
### Integration Tests

To run the integration tests you must first create your test database, if you already configured the `.env.test`, just run the following command:

```js
npm run test
```

This will create your test database with the prisma schemas and run all the tests (integration and unit).

### Unit Tests

To run the unit tests you must access the back-end folder and run the following command: 

```js
npm run test:unit
```

This will only run the unit tests for the `recommendationService` file.

## Front-End and Back-End Tests
### End-2-End Tests

To run the E2E tests you must first access the back-end folder and host your back-end test server, using: 

```js
npm run dev:test
```

Then you have to run the react app at the front-end folder:

```js
npm start
```

Finally you can open the cypress interface and execute the E2E tests in there: 

```js
npx cypress open
```

## Authors
### Bruno Ruotolo

[![GitHub](https://img.shields.io/badge/-BrunoRuotolo-black?style=for-the-badge&logo=github&logoColor=white&link=https://github.com/bruno-ruotolo/)]([https://www.linkedin.com/in/bruno-amaral-ruotolo-295876186/](https://github.com/bruno-ruotolo/))
[![Gmail Badge](https://img.shields.io/badge/-brunoaruotolo@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:)](mailto:brunoaruotolo@gmail.com)
[![Linkedin Badge](https://img.shields.io/badge/-brunoamaralruotolo-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/bruno-amaral-ruotolo-295876186/)](https://www.linkedin.com/in/bruno-amaral-ruotolo-295876186/)
