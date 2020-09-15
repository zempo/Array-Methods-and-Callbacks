import { fifaData } from "./fifa.js";
// console.log(fifaData);

// console.log("its working");
// ⚽️ M  V P ⚽️ //

/* Task 1: Investigate the data above. Practice accessing data by console.log-ing the following pieces of data 

(a) Home Team name for 2014 world cup final
(b) Away Team name for 2014 world cup final
(c) Home Team goals for 2014 world cup final
(d) Away Team goals for 2014 world cup final
(e) Winner of 2014 world cup final */

// console.log(fifaData[828]);

console.log(
  "Task1:\n",
  `(a) ${fifaData[828]["Home Team Name"]}`,
  "\n",
  `(b) ${fifaData[828]["Away Team Name"]}`,
  "\n",
  `(c) ${fifaData[828]["Home Team Goals"]}`,
  "\n",
  `(d) ${fifaData[828]["Away Team Goals"]}`,
  "\n",
  `(e) ${fifaData[828]["Win conditions"]}`
);

/* Task 2: Create a function called  getFinals that takes `data` as an argument and returns an array of objects with only finals data */
function getFinals(data, query = "Final") {
  // filter returns a new array
  return data.filter((game) => game["Stage"] === query);
}

getFinals(fifaData);
console.log("Task 2: ", getFinals(fifaData));

/* Task 3: Implement a higher-order function called `getYears` that accepts the callback function `getFinals`, 
and returns an array called `years` containing all of the years in the dataset */

function getYears(data, cb) {
  // map returns a new array
  return cb(data).map((game) => game["Year"]);
}

getYears(fifaData, getFinals);
console.log("Task 3:", getYears(fifaData, getFinals));

/* Task 4: Implement a higher-order function called `getWinners`, that accepts the callback function `getFinals()`
 and determine the winner (home or away) of each `finals` game. Return the name of all winning countries in an array called `winners` */

function getWinners(data, cb) {
  let winners = [];
  cb(data).forEach((game) => {
    let h = game["Home Team Goals"],
      hName = game["Home Team Name"],
      a = game["Away Team Goals"],
      aName = game["Away Team Name"];

    if (h > a) {
      winners.push(hName);
    } else if (h < a) {
      winners.push(aName);
    } else {
      winners.push(`${hName} & ${aName}`);
    }
  });
  return winners;
}

getWinners(fifaData, getFinals);
console.log("Task 4:", getWinners(fifaData, getFinals));

/* Task 5: Implement a higher-order function called `getWinnersByYear` that accepts the following parameters 
and returns a set of strings "In {year}, {country} won the world cup!" 

Parameters: 
 * callback function getWinners
 * callback function getYears
 */

function getWinnersByYear(data, cb1, cb2) {
  let winner = cb1(data, getFinals);
  let year = cb2(data, getFinals);

  return winner.map((el, i) => {
    return `In ${year[i]}, ${el} won the world cup!`;
  });
}

getWinnersByYear(fifaData, getWinners, getYears);
console.log("Task 5:", getWinnersByYear(fifaData, getWinners, getYears));

/* Task 6: Write a function called `getAverageGoals` that accepts a parameter `data`
 and returns the the average number of home team goals and away team goals scored per match (Hint: use .reduce and do this in 2 steps) */

function getAverageGoals(data) {
  const total = (key) => {
    return data.reduce((acc, cur) => acc + cur[key], 0);
  };

  return `Home Goal Avg: ${(total("Home Team Goals") / data.length).toPrecision(
    4
  )} \nAway Goal Avg: ${(total("Away Team Goals") / data.length).toPrecision(
    4
  )}`;
}

getAverageGoals(fifaData);
console.log("Task 6:", getAverageGoals(fifaData));

/// STRETCH 🥅 //

/* Stretch 1: Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(/* code here */) {
  /* code here */
}

getCountryWins();

/* Stretch 3: Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */

function getGoals(/* code here */) {
  /* code here */
}

getGoals();

/* Stretch 4: Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */

function badDefense(/* code here */) {
  /* code here */
}

badDefense();

/* If you still have time, use the space below to work on any stretch goals of your chosing as listed in the README file. */
