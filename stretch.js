import { fifaData } from "./fifa.js";

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

function getAppearances(data, cb, cb2, cb3) {
  let currentTeam = "";
  var goalAcc = 0;
  var allowedAcc = 0;
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
      allowedAcc += g["Away Team Goals"];
      appearancesAcc += 1;

      // end of data
      if (i_main === Games.length - 1) {
        teamGoals[cb3(teamGoals, g["Home Team Name"])].goals +=
          g["Home Team Goals"] + goalAcc;

        teamGoals[cb3(teamGoals, g["Home Team Name"])].allowed +=
          g["Away Team Goals"] + allowedAcc;

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
        allowedAcc = 0;
        appearancesAcc = 0;

        teamGoals[cb3(teamGoals, g["Home Team Name"])].goals +=
          g["Home Team Goals"];

        teamGoals[cb3(teamGoals, g["Home Team Name"])].allowed +=
          g["Away Team Goals"];

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
          allowed: g["Away Team Goals"],
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
      allowedAcc += g["Home Team Goals"];
      appearancesAcc += 1;
      // end of array
      if (i_main === Games.length - 1) {
        teamGoals[cb3(teamGoals, g["Away Team Name"])].goals +=
          g["Away Team Goals"] + goalAcc;

        teamGoals[cb3(teamGoals, g["Away Team Name"])].allowed +=
          g["Home Team Goals"] + goalAcc;

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
        allowedAcc = 0;
        appearancesAcc = 0;

        teamGoals[cb3(teamGoals, g["Away Team Name"])].goals +=
          g["Away Team Goals"];

        teamGoals[cb3(teamGoals, g["Away Team Name"])].allowed +=
          g["Home Team Goals"] + goalAcc;

        teamGoals[cb3(teamGoals, g["Away Team Name"])].appearances += 1;
        // has not been mapped before
      } else {
        // start tracking 'new team'
        currentTeam = g["Away Team Name"];
        goalAcc = 0;
        allowedAcc = 0;
        appearancesAcc = 0;

        teamGoals.push({
          name: g["Away Team Name"],
          initials: g["Away Team Initials"],
          goals: g["Away Team Goals"],
          allowed: g["Home Team Goals"],
          appearances: 1,
        });
      }
    }
  });

  let participants = teamGoals.map((t) => {
    return {
      name: t.name,
      initials: t.initials,
      goals: t.goals,
      allowed: t.allowed,
      appearances: t.appearances,
      goalAvg: t.goals / t.appearances,
      allowedAvg: t.allowed / t.appearances,
    };
  });

  return participants.sort(cb("name"));
}

let fifaCountries = getAppearances(fifaData, goalSort, teamExists, getTeamIdx);

const container = document.querySelector(".games-container ul");

function getFifaGames(data) {
  let template = ``;
  data.forEach((g) => {
    template += `<li><h2>${g.name} (${g.initials})</h2>
    <ul>
    <li>Appearances: ${g.appearances}</li>
    <li>Goals Scored: ${g.goals}</li>
    <li>Goals Allowed: ${g.allowed}</li>
    <li>Scored Avg: ${g.goalAvg.toPrecision(4)}</li>
    <li>Allowed Avg: ${g.allowedAvg.toPrecision(4)}</li>
    </ul></li>`;
  });

  container.innerHTML = template;
}

getFifaGames(fifaCountries);

function queryCountries(data, query, type) {
  return data.filter((el) => el.initials === query)[0][type];
}

console.log(
  "\nStretch 4:",
  queryCountries(fifaCountries, "USA", "appearances")
);

console.log("\nStretch 5:", queryCountries(fifaCountries, "USA", "goals"));
