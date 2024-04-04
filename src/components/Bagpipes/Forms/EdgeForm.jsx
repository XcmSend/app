import React from 'react';

const EdgeForm = ({ edge, onSubmit, onClose }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    onSubmit(data); // Pass the form data to the parent component or handle it as needed
  };

  return (
    <div className="edge-form-container" >
      <form onSubmit={handleSubmit}>
        {/* Example form field */}
        <label>
          Label:
          <input name="label" defaultValue={edge.label} />
        </label>
        {/* Add more fields as needed */}
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default EdgeForm;
