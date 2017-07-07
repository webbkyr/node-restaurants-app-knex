'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { DATABASE, PORT } = require('./config');
const knex = require('knex')(DATABASE);

const app = express();
app.use(bodyParser.json());

app.get('/restaurants', (req, res) => {

  knex.select('id', 'name', 'cuisine', 'borough')
    .from('restaurants')
    .limit(10)
    .then(results => res.json(results));
});

// Hydrate
app.get('/restaurants/:id', (req, res) => {
  knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
    .from('restaurants')
    .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
    .where('restaurants.id', req.params.id)
    .orderBy('date', 'desc')
    .limit(10)
    .then(results => results.forEach(row => {
      const hydrated = {};
      if (!(row.id in hydrated)) {
        hydrated[row.id] = {
          id: row.id,
          name: row.name,
          cuisine: row.cuisine,
          borough: row.borough,
          grades: []
        };
      }
      hydrated[row.id].grades.push({
        gradeId: row.gradeId,
        grade: row.grade,
        score: row.score
      });
      res.json(hydrated);
    }));
});

//Dehydrate
app.post('/restaurants/', (req, res) => {

  const required = ['name', 'cuisine', 'borough', 'grades'];

  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      console.error(errorMessage);
      res.status(400).end();
      return;
    }
  });

  knex('restaurants')
    .returning('id')
    .insert({
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough,
    })
    .then(id => {    
      let promises = [];
      req.body.grades.forEach(grade => {
        knex('grades')
          .insert({
            restaurant_id: id[0],
            grade: grade.grade,
            score: grade.score,
            date: knex.fn.now()
          })
          .then(promise => promises.push(promise));
      });
      Promise.all(promises)
        .then(() => {
          res.location(`/restaurants/${id}`).sendStatus(201);
        })
        .catch(err => {
          console.error(err);
        });
    });
});

app.listen(PORT);