import React, { Component } from 'react';

// Components
import NameInput from './components/NameInput';
import AvailabilityTable from './components/AvailabilityTable';
import BookedTable from './components/BookedTable';

class App extends Component {
  constructor() {
    super();
    this.inputRef = React.createRef();
  }

  state = {
    today: null,
    availability: {},
    studentName: '',
    nameInputError: false,
    todayError: false,
    availabilityError: false,
  };

  componentDidMount() {
    this.fetchToday();
    this.fetchAvailability();
  }

  fetchToday = async () => {
    try {
      const res = await fetch('http://localhost:4433/today');
      const { today = null } = await res.json();
      this.setState({ today });
    } catch (e) {
      this.setState({ todayError: true });
      console.error("Failed to fetch 'today' data", e);
    }
  };

  fetchAvailability = async () => {
    try {
      const res = await fetch('http://localhost:4433/availability');
      const { availability = {} } = await res.json();
      this.setState({ availability });
    } catch (e) {
      this.setState({ availabilityError: true });
      console.error("Failed to fetch 'availability' data", e);
    }
  };

  handleNameInputChange = e => {
    const { target: { value = '' } } = e;
    e.preventDefault();
    this.setState({ studentName: value });
  };

  handleBookRequest = async (advisor, availability) => {
    const { studentName = '' } = this.state;
    // If the name input is empty set name error to true and return
    if (studentName.length === 0) {
      this.setState({ nameInputError: true });
      this.inputRef &&
        this.inputRef.current &&
        this.inputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      return;
    }
    try {
      // appointment payload
      const payload = {
        studentName,
        advisor,
        availability,
      };
      const bookResponse = await fetch(
        'http://localhost:4433/book_appointment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );
      const { data: updatedAvailability } = await bookResponse.json();
      this.setState({
        availability: updatedAvailability,
        nameInputError: false,
      });
    } catch (e) {
      console.error(
        'There was an error while trying to book an appointment',
        e,
      );
    }
  };

  render() {
    const {
      today = null,
      availability = {},
      studentName = '',
      nameInputError = false,
      availabilityError,
      todayError,
    } = this.state;

    return (
      <div className="App container">
        <h1>Book Time with an Advisor</h1>
        {!todayError && today && <span id="today">Today is {today}.</span>}
        {todayError && (
          <h3 className="alert-danger">
            An error occured while trying to get today's date. Please refresh
            the page.
          </h3>
        )}
        <NameInput
          onChange={this.handleNameInputChange}
          error={nameInputError}
          value={studentName}
          scrollRef={this.inputRef}
        />
        {availabilityError && (
          <h3 className="alert-danger">{`An error occured while trying to get the advisors' availability. Please refresh the page.`}</h3>
        )}
        {!availabilityError && (
          <React.Fragment>
            <AvailabilityTable
              advisorAvailability={availability}
              onClick={this.handleBookRequest}
            />
            <BookedTable bookedTimes={availability} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
