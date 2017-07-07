'use strict';
const { DATABASE } = require('./config');
const knex = require('knex')(DATABASE);

// clear the console before each run
process.stdout.write('\x1Bc');

/*******************
 * Note, there are 2 solutions presented
 * - A 'naive' solution
 * - A 'sophisticated' solution
 *******************/

// #1 Naive Solution
knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('date', 'asc')
  .limit(10)
  .then(results => {

    const hydrated = {};
    results.forEach(row => {
      if (!(row.id in hydrated)) {
        hydrated[row.id] = {
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
    });
    console.log(JSON.stringify(hydrated, null, 2));
  });

// #2 Sophistacted Solution
knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('date', 'asc')
  .limit(10)
  .then(results => {
    
    const hydrated = [], lookup = {};
    for (let thing of results) {
      if (!lookup[thing.id]) {
        lookup[thing.id] = {
          id: thing.id,
          name: thing.name,
          age: thing.age,
          pets: []
        };
        hydrated.push(lookup[thing.id]);
      }

      lookup[thing.id].pets.push({
        petName: thing.petName,
        petType: thing.petType
      });
    }
    console.log(JSON.stringify(hydrated, null, 2));
    
  });


// Destroy the connection pool
knex.destroy().then(() => { console.log('closed'); });