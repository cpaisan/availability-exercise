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
 * @param {array} bookedTimes - object with advisor id's as keys and advisor's schedules in an array as the values
 * @returns {array} JSX elements - array of table rows that display advisor, student name, and date/time
 */
const constructBookedRows = bookedTimes =>
  Object.entries(bookedTimes).reduce((bookedRows, [advisor, schedule]) => {
    schedule.forEach(timeslot => {
      const { isBooked, studentName, availability } = timeslot;
      if (isBooked) {
        bookedRows.push(
          <tr key={availability}>
            <td>{advisor}</td>
            <td>{studentName}</td>
            <td>
              <time dateTime={availability}>
                {new Date(availability).toLocaleDateString(
                  "en-US",
                  DATE_OPTIONS
                )}
              </time>
            </td>
          </tr>
        );
      }
    });
    return bookedRows;
  }, []);

const BookedTable = ({ bookedTimes = {} }) => {
  const bookedRows = constructBookedRows(bookedTimes);
  return (
    <React.Fragment>
      <h2>Booked Times</h2>
      <table className="bookings table">
        <thead>
          <tr>
            <th>Advisor ID</th>
            <th>Student Name</th>
            <th>Date/Time</th>
          </tr>
        </thead>
        <tbody>{bookedRows}</tbody>
      </table>
    </React.Fragment>
  );
};

BookedTable.propTypes = {
  bookedTimes: PropTypes.object.isRequired
};

export default BookedTable;
