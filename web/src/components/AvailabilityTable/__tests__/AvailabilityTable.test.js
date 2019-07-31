import React from "react";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import AvailabilityTable from "../AvailabilityTable";

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
      isBooked: false,
      studentName: null
    }
  ],
  "372955": [
    {
      availability: "2019-08-01T11:00:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-01T10:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ]
};

describe("<AvailabilityTable/>", () => {
  it("should render a table with available times", () => {
    const wrapper = mount(
      <AvailabilityTable onClick={() => {}} advisorAvailability={apiData} />
    );
    // Two advisor rows and the table head row
    expect(wrapper.find("tr").length).toEqual(3);
    // 5 available advisor times
    expect(wrapper.find("li").length).toEqual(5);
  });

  it('should handle "Book" button clicks', () => {
    const onClickMock = jest.fn();
    const wrapper = mount(
      <AvailabilityTable onClick={onClickMock} advisorAvailability={apiData} />
    );
    wrapper
      .find("button")
      .at(0)
      .simulate("click");
    expect(onClickMock.mock.calls.length).toEqual(1);
    expect(onClickMock).toHaveBeenCalledWith(
      "319369",
      "2019-08-04T10:30:00-04:00"
    );
  });
});
