require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Attempt = require('../lib/models/Attempt');
const Recipe = require('../lib/models/Recipe');

describe('attempt routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let recipe;
  beforeEach(async() => {
    recipe = await Recipe.create({
      name: 'Pasta',
      directions: ['Just make pasta it\'s easy'],
      ingredients: [{
        name: 'pasta',
        amount: 1,
        measurement: 'serving'
      }]
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an attempt with POST', () => {
    return request(app)
      .post('/api/v1/attempts')
      .send({
        recipeId: recipe._id,
        dateOfAttempt: 'December 5th, 2019',
        notes: 'Soooo good',
        rating: 5
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfAttempt: 'December 5th, 2019',
          notes: 'Soooo good',
          rating: 5,
          __v: 0
        });
      });
  });

  it('gets all attempts with GET', async() => {
    const attempts = await Attempt.create([
      {
        recipeId: recipe._id,
        dateOfAttempt: 'December 5th, 2019',
        notes: 'Soooo good',
        rating: 5
      },
      {
        recipeId: recipe._id,
        dateOfAttempt: 'December 6th, 2019',
        notes: 'Pretty good',
        rating: 3
      },
      {
        recipeId: recipe._id,
        dateOfAttempt: 'December 7th, 2019',
        notes: 'Soooo bad',
        rating: 1
      }
    ]);

    return request(app)
      .get('/api/v1/attempts')
      .then(res => {
        attempts.forEach(attempt => {
          expect(res.body).toContainEqual({
            _id: attempt._id.toString(),
            recipeId: recipe._id.toString(),
            dateOfAttempt: attempt.dateOfAttempt,
            notes: attempt.notes,
            rating: attempt.rating,
            __v: 0
          });
        });
      });
  });

  it('gets an attempt by id with GET/:id', async() => {
    const attempt = await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: 'December 5th, 2019',
      notes: 'Soooo good',
      rating: 5
    });

    return request(app)
      .get(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: JSON.parse(JSON.stringify(recipe)),
          dateOfAttempt: 'December 5th, 2019',
          notes: 'Soooo good',
          rating: 5,
          __v: 0
        });
      });
  });

  it('updates an item by id with PATCH/:id', async() => {
    const attempt = await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: 'December 5th, 2019',
      notes: 'Soooo good',
      rating: 5
    });

    return request(app)
      .patch(`/api/v1/attempts/${attempt._id}`)
      .send({ notes: 'Actually it was bad', rating: 1 })
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: recipe._id.toString(),
          dateOfAttempt: 'December 5th, 2019',
          notes: 'Actually it was bad',
          rating: 1,
          __v: 0
        });
      });
  });

  it('deletes an item by id with DELETE/:id', async() => {
    const attempt = await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: 'December 5th, 2019',
      notes: 'Soooo good',
      rating: 5
    });

    return request(app)
      .delete(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: recipe._id.toString(),
          dateOfAttempt: 'December 5th, 2019',
          notes: 'Soooo good',
          rating: 5,
          __v: 0
        });
      });
  });

});
