import React from "react";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// Components
import NameInput from "../NameInput";

configure({ adapter: new Adapter() });

describe("<NameInput/>", () => {
  it("should render with the given value", () => {
    const onChangeMock = jest.fn();
    const value = "Foo Baz";
    const wrapper = mount(
      <NameInput onChange={onChangeMock} value={value} error={false} />
    );
    expect(wrapper.find("input").props().value).toEqual(value);
  });

  it("should call the upstream onChange when a user types into the input", () => {
    const onChangeMock = jest.fn();
    const onChangeEvent = { target: { value: "Quux" } };
    const wrapper = shallow(
      <NameInput onChange={onChangeMock} value="" error={false} />
    );
    wrapper.find("input").simulate("change", onChangeEvent);
    expect(onChangeMock.mock.calls.length).toEqual(1);
    expect(onChangeMock).toHaveBeenCalledWith(onChangeEvent);
  });

  it("should display an error message when error is true", () => {
    const wrapper = mount(
      <NameInput onChange={() => {}} value="" error={true} />
    );
    expect(wrapper.find("span").props().children).toEqual(
      "Your name cannot be empty."
    );
  });
});
