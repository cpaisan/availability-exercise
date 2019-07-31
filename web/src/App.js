import React, { Component } from "react";

// Components
import NameInput from "./components/NameInput";
import AvailabilityTable from "./components/AvailabilityTable";
import BookedTable from "./components/BookedTable";

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

  handleBookRequest = async (advisor, availability) => {
    const { studentName = "" } = this.state;
    // If the name input is empty set name error to true and return
    if (studentName.length === 0) {
      this.setState({ nameInputError: true });
      return;
    }
    try {
      // appointment payload
      const payload = {
        studentName,
        advisor,
        availability
      };
      const bookResponse = await fetch(
        "http://localhost:4433/book_appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );
      const { data: updatedAvailability } = await bookResponse.json();
      this.setState({
        availability: updatedAvailability,
        nameInputError: false
      });
    } catch (e) {
      console.error(
        "There was an error while trying to book an appointment",
        e
      );
    }
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
          onClick={this.handleBookRequest}
        />

        <BookedTable bookedTimes={availability} />
      </div>
    );
  }
}

export default App;
