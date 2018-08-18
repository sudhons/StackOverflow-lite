[![Build Status](https://travis-ci.org/sudhons/StackOverflow-lite.svg?branch=api)](https://travis-ci.org/sudhons/StackOverflow-lite)
[![Coverage Status](https://coveralls.io/repos/github/sudhons/StackOverflow-lite/badge.svg?branch=api)](https://coveralls.io/github/sudhons/StackOverflow-lite?branch=api)

# StackOverflow-lite
StackOverflow-lite is a platform where people can ask questions and provide answers.

## [User Interface](https://sudhons.github.io/StackOverflow-lite)
Implements the following features:
* View a list of recently asked questions on the platform
* View a question with all the answers posted for it and add an answer.
* Post a question.
* user’s profile which displays:
  * The number of questions asked.
  * The number of answers given.
  * The list of questions asked by the user with the the most answers.
  * The list of recent questions asked by the user.

## API
Implements following endpoints:
* GET /api/v1/questions
* POST /api/v1/questions
* GET /api/v1/questions/:id
* PUT /api/v1/questions/:id
* DELETE /api/v1/questions/:id

* POST /api/v1/questions/:qtnId/answers
* GET /api/v1/questions/:qtnId/answers/:ansId
* PUT /api/v1/questions/:qtnId/answers/:ansId
* DELETE /api/v1/questions/:qtnId/answers/:ansId

## Technologies
* Front-end: Html, CSS and Javascript
* Back-end: Node/Express framework
