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

// make a helper

function get2014(data) {
  return data.filter((g) => {
    if (g["Stage"] === "Final" && g["Year"] == 2014) {
      return true;
    }
  });
}

const final2014 = get2014(fifaData)[0];

console.log(
  "Task1:\n",
  `(a) ${final2014["Home Team Name"]}`,
  "\n",
  `(b) ${final2014["Away Team Name"]}`,
  "\n",
  `(c) ${final2014["Home Team Goals"]}`,
  "\n",
  `(d) ${final2014["Away Team Goals"]}`,
  "\n",
  `(e) ${final2014["Win conditions"]}`
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
    if (el.includes("&")) {
      return `In ${year[i]}, there was a tie between ${el}!`;
    }
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

/* Stretch 1: Create a function called `getCountryWins` that takes the parameters `data` and `team initials`
 and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data, query) {
  let wins = data.reduce((acc, cur) => {
    const conditions = {
      isHome: cur["Home Team Initials"] === query,
      homeWins: cur["Home Team Goals"] > cur["Away Team Goals"],
      isAway: cur["Away Team Initials"] === query,
      awayWins: cur["Away Team Goals"] > cur["Home Team Goals"],
    };

    if (conditions.isHome) {
      if (conditions.homeWins) return acc + 1;
      return acc;
    } else if (conditions.isAway) {
      if (conditions.awayWins) return acc + 1;
      return acc;
    } else {
      return acc;
    }
  }, 0);

  return `${wins} World Cup Game Wins for ${query}`;
}

getCountryWins(fifaData, "FRA");
console.log("Stretch 1:", getCountryWins(fifaData, "FRA"));
console.log("Stretch 1:", getCountryWins(fifaData, "USA"));
console.log("Stretch 1:", getCountryWins(fifaData, "YUG"));
/* Stretch 3: Write a function called getGoals() that accepts a parameter `data` and 
returns the team with the most goals score per appearance (average goals for) in the World Cup finals */
var participantGoals = [];

function goalSort(prop, order) {
  var sort_order = 1;
  if (order === "desc") {
    sort_order = -1;
  }
  return (a, b) => {
    if (a[prop] < b[prop]) {
      return -1 * sort_order;
    } else if (a[prop] > b[prop]) {
      return 1 * sort_order;
    } else {
      return 0 * sort_order;
    }
  };
}

function teamExists(data, query) {
  let exists = false;
  data.forEach((el) => {
    if (el.name === query) {
      exists = true;
    }
  });
  return exists;
}

function getTeamIdx(data, query) {
  let targetIdx;
  data.forEach((el, local_i) => {
    if (el.name === query) {
      targetIdx = local_i;
    }
  });
  return targetIdx;
}

function getGoals(data, cb, cb2, cb3) {
  let currentTeam = "";
  var goalAcc = 0;
  var appearancesAcc = 0;
  let teamGoals = [];

  // accumulate home game goals
  data.forEach((g, i_main, Games) => {
    const conditions = {
      isHome: g["Home Team Name"] === currentTeam,
      inResults: cb2(teamGoals, g["Home Team Name"]),
    };

    // still on the current, accumulating team
    if (conditions.isHome) {
      goalAcc += g["Home Team Goals"];
      appearancesAcc += 1;

      // end of data
      if (i_main === Games.length - 1) {
        teamGoals[cb3(teamGoals, g["Home Team Name"])].goals +=
          g["Home Team Goals"] + goalAcc;

        teamGoals[cb3(teamGoals, g["Home Team Name"])].appearances +=
          1 + appearancesAcc;
      }
      // on a new team
    } else {
      // has been mapped before
      if (currentTeam !== "" && conditions.inResults) {
        // retrack team
        currentTeam = g["Home Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamGoals[cb3(teamGoals, g["Home Team Name"])].goals +=
          g["Home Team Goals"];

        teamGoals[cb3(teamGoals, g["Home Team Name"])].appearances += 1;
      } else {
        // start tracking 'new team'
        currentTeam = g["Home Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamGoals.push({
          name: g["Home Team Name"],
          initials: g["Home Team Initials"],
          goals: g["Home Team Goals"],
          appearances: 1,
        });
      }
    }
  });

  // accumulate away game goals
  data.forEach((g, i_main, Games) => {
    const conditions = {
      isAway: g["Away Team Name"] === currentTeam,
      inResults: cb2(teamGoals, g["Away Team Name"]),
    };

    // still on the current, accumulating team
    if (conditions.isAway) {
      goalAcc += g["Away Team Goals"];
      appearancesAcc += 1;
      // end of array
      if (i_main === Games.length - 1) {
        teamGoals[cb3(teamGoals, g["Away Team Name"])].goals +=
          g["Away Team Goals"] + goalAcc;

        teamGoals[cb3(teamGoals, g["Away Team Name"])].appearances +=
          1 + appearancesAcc;
      }
      // on a new team
    } else {
      // has been mapped before
      if (currentTeam !== "" && conditions.inResults) {
        // retrack team
        currentTeam = g["Away Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamGoals[cb3(teamGoals, g["Away Team Name"])].goals +=
          g["Away Team Goals"];

        teamGoals[cb3(teamGoals, g["Away Team Name"])].appearances += 1;
        // has not been mapped before
      } else {
        // start tracking 'new team'
        currentTeam = g["Away Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamGoals.push({
          name: g["Away Team Name"],
          initials: g["Away Team Initials"],
          goals: g["Away Team Goals"],
          appearances: 1,
        });
      }
    }
  });

  let teamAvgs = teamGoals.map((t) => {
    return {
      name: t.name,
      initials: t.initials,
      goals: t.goals,
      appearances: t.appearances,
      goalAvg: t.goals / t.appearances,
    };
  });

  participantGoals = teamAvgs.sort(cb("name", "desc"));

  let bestTeam = teamAvgs.sort(cb("goalAvg", "desc"))[0];

  return `\n \n"${bestTeam.initials}-${
    bestTeam.name
  }" was the highest scoring team on average\n \n${
    bestTeam.goals
  } total goals scored\n \n${(
    bestTeam.goals / bestTeam.appearances
  ).toPrecision(4)} over ${bestTeam.appearances} appearance(s)`;
}

getGoals(fifaData, goalSort, teamExists, getTeamIdx);
console.log(
  "\nStretch 2:",
  getGoals(fifaData, goalSort, teamExists, getTeamIdx)
);

/* Stretch 4: Write a function called badDefense() that accepts a parameter `data`
 and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */
var participants = [];

function badDefense(data, cb, cb2, cb3) {
  let currentTeam = "";
  var goalAcc = 0;
  var appearancesAcc = 0;
  let teamAllowed = [];

  // accumulate home game allowed goals
  data.forEach((g, i_main, Games) => {
    const conditions = {
      isHome: g["Home Team Name"] === currentTeam,
      inResults: cb2(teamAllowed, g["Home Team Name"]),
    };

    // still on the current, accumulating team
    if (conditions.isHome) {
      goalAcc += g["Away Team Goals"];
      appearancesAcc += 1;

      // end of data
      if (i_main === Games.length - 1) {
        teamAllowed[cb3(teamAllowed, g["Home Team Name"])].goals +=
          g["Away Team Goals"] + goalAcc;

        teamAllowed[cb3(teamAllowed, g["Home Team Name"])].appearances +=
          1 + appearancesAcc;
      }
      // on a new team
    } else {
      // has been mapped before
      if (currentTeam !== "" && conditions.inResults) {
        // retrack team
        currentTeam = g["Home Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamAllowed[cb3(teamAllowed, g["Home Team Name"])].goals +=
          g["Away Team Goals"];

        teamAllowed[cb3(teamAllowed, g["Home Team Name"])].appearances += 1;
      } else {
        // start tracking 'new team'
        currentTeam = g["Home Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamAllowed.push({
          name: g["Home Team Name"],
          initials: g["Home Team Initials"],
          goals: g["Home Team Goals"],
          appearances: 1,
        });
      }
    }
  });

  // accumulate away game allowed goals
  data.forEach((g, i_main, Games) => {
    const conditions = {
      isAway: g["Away Team Name"] === currentTeam,
      inResults: cb2(teamAllowed, g["Away Team Name"]),
    };

    // still on the current, accumulating team
    if (conditions.isAway) {
      goalAcc += g["Home Team Goals"];
      appearancesAcc += 1;
      // end of array
      if (i_main === Games.length - 1) {
        teamAllowed[cb3(teamAllowed, g["Away Team Name"])].goals +=
          g["Home Team Goals"] + goalAcc;

        teamAllowed[cb3(teamAllowed, g["Away Team Name"])].appearances +=
          1 + appearancesAcc;
      }
      // on a new team
    } else {
      // has been mapped before
      if (currentTeam !== "" && conditions.inResults) {
        // retrack team
        currentTeam = g["Away Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamAllowed[cb3(teamAllowed, g["Away Team Name"])].goals +=
          g["Home Team Goals"];

        teamAllowed[cb3(teamAllowed, g["Away Team Name"])].appearances += 1;
        // has not been mapped before
      } else {
        // start tracking 'new team'
        currentTeam = g["Away Team Name"];
        goalAcc = 0;
        appearancesAcc = 0;

        teamAllowed.push({
          name: g["Away Team Name"],
          initials: g["Away Team Initials"],
          goals: g["Home Team Goals"],
          appearances: 1,
        });
      }
    }
  });

  let teamAvgs = teamAllowed.map((t) => {
    return {
      name: t.name,
      initials: t.initials,
      goals: t.goals,
      appearances: t.appearances,
      goalAvg: t.goals / t.appearances,
    };
  });

  participants = teamAvgs.sort(cb("name", "desc"));

  let worstTeam = teamAvgs.sort(cb("goalAvg", "desc"))[0];

  return `\n \n"${worstTeam.initials}-${
    worstTeam.name
  }" had the worst defense on average \n \n${
    worstTeam.goals
  } total goals were allowed\n \n${(
    worstTeam.goals / worstTeam.appearances
  ).toPrecision(4)} over ${worstTeam.appearances} appearance(s)`;
}

badDefense(fifaData, goalSort, teamExists, getTeamIdx);

console.log(
  "\nStretch 3:",
  badDefense(fifaData, goalSort, teamExists, getTeamIdx)
);

/* If you still have time, use the space below to work on any stretch goals of your chosing as listed in the README file. */
