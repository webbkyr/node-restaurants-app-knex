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

  // Sanitize data before inserting!
  let restaurant_id;
  knex
    .into('restaurants')
    .insert({
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough
    })
    .returning('id')
    .then(result => {
      restaurant_id = result[0];
      const gradesToPost = req.body.grades.map(grade => {
        return {
          restaurant_id: restaurant_id,
          grade: grade.grade,
          score: grade.score
        };
      });

      return knex
        .insert(gradesToPost)
        .into('grades');
    })
    .then(() => {
      res.location(`/restaurants/${restaurant_id}`).sendStatus(201);
    });
});




app.listen(PORT);
