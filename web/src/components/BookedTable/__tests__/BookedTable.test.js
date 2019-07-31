import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import BookedTable from "../BookedTable";

const apiData = {
  "319369": [
    {
      availability: "2019-08-04T10:30:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-04T11:00:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-04T20:00:00-04:00",
      isBooked: true,
      studentName: "Foo"
    }
  ],
  "372955": [
    {
      availability: "2019-08-01T11:00:00-04:00",
      isBooked: true,
      studentName: "Bar"
    },
    {
      availability: "2019-08-01T10:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ]
};

describe("<BookedTable/>", () => {
  it("should render rows with booked appointments", () => {
    const wrapper = mount(<BookedTable bookedTimes={apiData} />);
    // Advisor: 319369, student name: "Foo", date/time:
    expect(
      wrapper
        .find("tr")
        .at(1)
        .find("td")
        .at(0)
        .props().children
    ).toEqual("319369");
    expect(
      wrapper
        .find("tr")
        .at(1)
        .find("td")
        .at(1)
        .props().children
    ).toEqual("Foo");
    expect(
      wrapper
        .find("tr")
        .at(1)
        .find("td")
        .at(2)
        .find("time")
        .props().children
    ).toEqual("8/4/2019, 5:00 PM");
    // Advisor: 372955, student name: "Foo", date/time:
    expect(
      wrapper
        .find("tr")
        .at(2)
        .find("td")
        .at(0)
        .props().children
    ).toEqual("372955");
    expect(
      wrapper
        .find("tr")
        .at(2)
        .find("td")
        .at(1)
        .props().children
    ).toEqual("Bar");
    expect(
      wrapper
        .find("tr")
        .at(2)
        .find("td")
        .at(2)
        .find("time")
        .props().children
    ).toEqual("8/1/2019, 8:00 AM");
  });
});
