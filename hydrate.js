'use strict';

const { DATABASE, PORT } = require('./config');
const knex = require('knex')(DATABASE);

// clear the console before each run
console.log('\x1b\c');

knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('date', 'asc')
  .limit(10)
  .then(results => {

    // naive approach
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

knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('date', 'asc')
  .limit(10)
  .then(results => {
    
    // sophisticated approach
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