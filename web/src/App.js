import React, { Component } from "react";

// Components
import NameInput from "./components/NameInput";
import AvailabilityTable from "./components/AvailabilityTable";

class App extends Component {
  state = {
    today: null,
    availability: {},
    studentName: "",
    nameInputError: false
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4433/today");
      const { today = null, availability = {} } = await res.json();
      this.setState({ today, availability });
    } catch (e) {
      console.error("Failed to fetch 'today and availability' data", e);
    }
  };

  handleNameInputChange = e => {
    const {
      target: { value = "" }
    } = e;
    e.preventDefault();
    this.setState({ studentName: value });
  };

  render() {
    const {
      today = null,
      availability = {},
      studentName = "",
      nameInputError = false
    } = this.state;

    return (
      <div className="App container">
        <h1>Book Time with an Advisor</h1>

        {today && <span id="today">Today is {today}.</span>}

        <NameInput
          onChange={this.handleNameInputChange}
          error={nameInputError}
          value={studentName}
        />

        <AvailabilityTable
          advisorAvailability={availability}
          onClick={() => {}}
        />

        <h2>Booked Times</h2>
        <table className="bookings table">
          <thead>
            <tr>
              <th>Advisor ID</th>
              <th>Student Name</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>36232</td>
              <td>John Smith</td>
              <td>
                <time dateTime="2019-04-03T10:00:00-04:00">
                  4/3/2019 10:00 am
                </time>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
