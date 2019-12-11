const mongoose = require('mongoose');
const Attempt = require('./Attempt');

describe('Attempt model', () => {
  it('has a required recipeId field', () => {
    const attempt = new Attempt({
      dateOfAttempt: 'December 5th, 2019',
      notes: 'Soooo good',
      rating: 5
    });

    const { errors } = attempt.validateSync();
    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

  it('has a required dateOfAttempt field', () => {
    const attempt = new Attempt({
      recipeId: 1,
      notes: 'Soooo good',
      rating: 5
    });

    const { errors } = attempt.validateSync();
    expect(errors.dateOfAttempt.message).toEqual('Path `dateOfAttempt` is required.');
  });

  it('has a required notes field', () => {
    const attempt = new Attempt({
      recipeId: 1,
      dateOfAttempt: 'December 5th, 2019',
      rating: 5
    });

    const { errors } = attempt.validateSync();
    expect(errors.notes.message).toEqual('Path `notes` is required.');
  });

  it('has a required rating field', () => {
    const attempt = new Attempt({
      recipeId: 1,
      dateOfAttempt: 'December 5th, 2019',
      notes: 'Soooo good'
    });

    const { errors } = attempt.validateSync();
    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });
});
