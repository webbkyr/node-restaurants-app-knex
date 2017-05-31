'use strict';

const Treeize = require('treeize');
const restaurants = new Treeize();

const { DATABASE, PORT } = require('./config');
const knex = require('knex')(DATABASE);

// clear the console before each run
console.log('\x1b\c');

knex.select('restaurants.id', 'name', 'cuisine as details:cuisine', 'borough as details:borough', 'grades.id as grades:id', 'grade as grades:grade', 'score as grades:score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('id', 'asc')
  .limit(2)
  .then(results => {
    console.log('BEFORE');
    console.log(JSON.stringify(results, null, 2))

    restaurants.grow(results);
    
    console.log('AFTER');
    console.log(JSON.stringify(restaurants.getData(), null, 2));
  });

// Destroy the connection pool
knex.destroy().then(() => { console.log('closed'); });