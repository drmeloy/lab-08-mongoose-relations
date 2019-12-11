const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Attempt = require('../models/Attempt');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })
  .get('/', (req, res) => {
    let query = {};
    if(req.query.ingredient){
      query = { 'ingredients.name': req.query.ingredient };
    }
    Recipe
      .find(query)
      .then(recipes => res.send(recipes));
  })
  .get('/:id', (req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Attempt.find({ recipeId: req.params.id })
    ])
      .then(([recipe, attempts]) => {
        res.send({ ...recipe.toJSON(), attempts });
      });
  })
  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })
  .delete('/:id', (req, res) => {
    Promise.all([
      Recipe.findByIdAndDelete(req.params.id),
      Attempt.deleteMany({ recipeId: req.params.id })
    ])
      .then(([recipe, attempts]) => res.send({ ...recipe.toJSON(), attempts }));
  });
