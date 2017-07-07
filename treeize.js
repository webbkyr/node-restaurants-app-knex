'use strict';

const { DATABASE } = require('./config');
const knex = require('knex')(DATABASE);

// clear the console before each run
process.stdout.write('\x1Bc');

const Treeize = require('treeize');
const restaurants = new Treeize();

/** Note the use of SQL alias like `cuisine as details:cuisine` and `grades.id as grades:id` */

knex.select('restaurants.id', 'name', 'cuisine as details:cuisine', 'borough as details:borough', 'grades.id as grades:id', 'grade as grades:grade', 'score as grades:score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('id', 'asc')
  .limit(2)
  .then(results => {
    console.log('BEFORE', JSON.stringify(results, null, 2));

    restaurants.grow(results);
    
    console.log('AFTER', JSON.stringify(restaurants.getData(), null, 2));
  });

// Destroy the connection pool
knex.destroy().then(() => { console.log('closed'); });