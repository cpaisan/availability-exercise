const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const today = () => new Date().toLocaleDateString();

let thinkfulAvailabilityData = {};

/**
 * @async function that requests the Thinkful API for advisor availability
 * @param {} - function does not accept any arguments
 * @return {Object} - returns an object where the keys are days and values are
 *                    objects with keys that represent date & time availability w/
 *                    advisor ID's as values
 * @throws {} - Thinkful API is unavailable and we display the error in the console
 */
const fetchThinkfulAvailabilityData = async () => {
  try {
    const thinkfulApiResponse = await fetch(
      "https://www.thinkful.com/api/advisors/availability"
    );
    const data = await thinkfulApiResponse.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

/**
  * @param {object} data - Thinkful availability API data
  * @return {object} formattedData - availability data grouped by advisor
                     each advisor key has a value of an array that contains objects
                     w/ availability (date/time), whether the date/time is booked,
                     and the student name of the booking
*/
const formatThinkfulData = data =>
  Object.values(data).reduce((formattedData, availabilityObject) => {
    Object.entries(availabilityObject).forEach(([dateTime, advisor]) => {
      let advisorAvailabity = formattedData[advisor] || [];
      advisorAvailabity = [
        ...advisorAvailabity,
        { availability: dateTime, isBooked: false, studentName: null }
      ];
      formattedData = {
        ...formattedData,
        [advisor]: advisorAvailabity
      };
    });
    return formattedData;
  }, {});

app.get("/today", async (req, res) => {
  const data = await fetchThinkfulAvailabilityData();
  const formattedThinkfulData = formatThinkfulData(data);
  res.send({
    today: today(),
    availability: formattedThinkfulData
  });
});


app.today = today;
module.exports = app;
