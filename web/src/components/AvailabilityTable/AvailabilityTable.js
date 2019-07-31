import React from "react";
import PropTypes from "prop-types";

const DATE_OPTIONS = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric"
};

/**
 * @param {array} schedule - array of schedule objects with isBooked, availability, and studentName keys
 * @param {string} advisor - advisor id
 * @param {function} onClick - handles the onClick event for the book button and submits a POST request to the API
 * @returns {array} JSX elements - array of list items displaying the available dates and times
 */
const constructAvailableList = (schedule = [], advisor = "", onClick) =>
  schedule.reduce((availableTimes, dateTime) => {
    const { isBooked, availability } = dateTime || {};
    if (!isBooked) {
      availableTimes.push(
        <li key={availability}>
          <time dateTime={availability} className="book-time">
            {new Date(availability).toLocaleDateString("en-US", DATE_OPTIONS)}
          </time>
          <button
            className="book btn-small btn-primary"
            onClick={() => onClick(advisor, availability)}
          >
            Book
          </button>
        </li>
      );
    }
    return availableTimes;
  }, []);

/**
 * @param {object} availability - object with advisor id's as keys and advisor's schedules in an array as the values
 * @param {function} onClick - handles the onClick event for the book button and submits a POST request to the API
 * @returns {array} JSX elements - array of table rows displaying the available timeslots
 */
const constructAvailableRows = (availability = {}, onClick) => {
  const data = Object.entries(availability).map(([advisor, schedule]) => (
    <tr key={advisor}>
      <td>{advisor}</td>
      <td>
        <ul className="list-unstyled">
          {constructAvailableList(schedule, advisor, onClick)}
        </ul>
      </td>
    </tr>
  ));
  return data;
};

const AvailabilityTable = props => {
  const { advisorAvailability = {}, onClick } = props;
  const tableRows = constructAvailableRows(advisorAvailability, onClick);
  return (
    <React.Fragment>
      <h2>Available Times</h2>
      <table className="advisors table">
        <thead>
          <tr>
            <th>Advisor ID</th>
            <th>Available Times</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </React.Fragment>
  );
};

AvailabilityTable.propTypes = {
  advisorAvailability: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default AvailabilityTable;
