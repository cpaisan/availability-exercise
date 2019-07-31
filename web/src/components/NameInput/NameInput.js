import React from 'react';
import PropTypes from 'prop-types';

const NameInput = ({ value, onChange, error, scrollRef }) => (
  <form id="name-form" className="col-md-6">
    <div className="form-group">
      <label htmlFor="name-field">Your Name</label>
      <input
        type="text"
        id="name-field"
        className="form-control"
        value={value}
        onChange={onChange}
        ref={scrollRef}
      />
      {error && (
        <span className="alert-danger">Your name cannot be empty.</span>
      )}
    </div>
  </form>
);

NameInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  scrollRef: PropTypes.object,
};

export default NameInput;
