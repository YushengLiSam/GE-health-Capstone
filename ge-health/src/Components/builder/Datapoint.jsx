import React, { useState } from 'react';

const Datapoint = ({ index, name, type, isMandatory, updateDatapoint, removeDatapoint }) => {
  const [datapointName, setDatapointName] = useState(name);
  const [datapointType, setDatapointType] = useState(type);
  const [mandatory, setMandatory] = useState(isMandatory);

  const handleNameChange = (e) => setDatapointName(e.target.value);
  const handleTypeChange = (e) => setDatapointType(e.target.value);
  const handleMandatoryChange = (e) => setMandatory(e.target.checked);

  const handleUpdate = () => {
    updateDatapoint(index, datapointName, datapointType, mandatory);
  };

  return (
    <div className="datapoint">
      <input
        type="text"
        placeholder="Datapoint Name"
        value={datapointName}
        onChange={handleNameChange}
      />
      <select value={datapointType} onChange={handleTypeChange}>
        <option value="Textbox - Numeric">Textbox - Numeric</option>
        <option value="Textbox">Textbox</option>
        <option value="List">List</option>
        <option value="Ordered list">Ordered list</option>
        <option value="Multiselect list">Multiselect list</option>
        <option value="Number spinner">Number spinner</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={mandatory}
          onChange={handleMandatoryChange}
        />
        Is Mandatory
      </label>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => removeDatapoint(index)}>Remove</button>
    </div>
  );
};

export default Datapoint;
