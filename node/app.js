const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

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
      'https://www.thinkful.com/api/advisors/availability',
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
  (!!data &&
    Object.values(data).reduce((formattedData, availabilityObject) => {
      Object.entries(availabilityObject).forEach(([dateTime, advisor]) => {
        let advisorAvailabity = formattedData[advisor] || [];
        advisorAvailabity = [
          ...advisorAvailabity,
          { availability: dateTime, isBooked: false, studentName: null },
        ];
        formattedData = {
          ...formattedData,
          [advisor]: advisorAvailabity,
        };
      });
      return formattedData;
    }, {})) ||
  {};

// Request Thinkful API data on server start
// TODO: Poll the API for updated data and merge w/ cached data
try {
  new Promise(async () => {
    const data = await fetchThinkfulAvailabilityData();
    const formattedThinkfulData = formatThinkfulData(data) || {};
    thinkfulAvailabilityData = formattedThinkfulData;
  });
} catch (e) {
  console.error('There was an error while fetching the Thinkful API', e);
}

// responds with today's date
app.get('/today', (req, res) => {
  res.send({
    today: today(),
  });
});

// responds with advisor availability
app.get('/availability', async (req, res) => {
  // Request Thinkful API for availability data if we do not have
  // the data in memory
  if (Object.keys(thinkfulAvailabilityData).length === 0) {
    try {
      const data = await fetchThinkfulAvailabilityData();
      const formattedThinkfulData = formatThinkfulData(data) || {};
      thinkfulAvailabilityData = formattedThinkfulData;
    } catch (e) {
      console.error('There was an error while fetching the Thinkful API', e);
    }
  }
  res.send({
    availability: thinkfulAvailabilityData,
  });
});

// responds with updated advisor availability data
app.post('/book_appointment', (req, res) => {
  const {
    studentName,
    advisor,
    availability: requestedAvailability,
  } = req.body;
  thinkfulAvailabilityData = {
    ...thinkfulAvailabilityData,
    [advisor]: (thinkfulAvailabilityData[advisor] || []).map(
      timeslot =>
        timeslot.availability === requestedAvailability && !timeslot.isBooked
          ? { ...timeslot, isBooked: true, studentName }
          : timeslot,
    ),
  };
  res.send({ data: thinkfulAvailabilityData });
});

app.today = today;
app.fetchThinkfulAvailabilityData = fetchThinkfulAvailabilityData;
app.formatThinkfulData = formatThinkfulData;
module.exports = app;
