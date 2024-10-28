import React, { useState } from 'react';
import Datapoint from './Datapoint';

const Subcategory = ({ index, name, datapoints, updateName, removeSubcategory }) => {
  const [localDatapoints, setLocalDatapoints] = useState(datapoints);

  const addDatapoint = () => {
    setLocalDatapoints([...localDatapoints, { name: '', type: 'Textbox' }]);
  };

  const updateDatapoint = (datapointIndex, newName, newType, isMandatory) => {
    const updatedDatapoints = [...localDatapoints];
    updatedDatapoints[datapointIndex] = { name: newName, type: newType, isMandatory };
    setLocalDatapoints(updatedDatapoints);
  };

  const removeDatapoint = (datapointIndex) => {
    const updatedDatapoints = localDatapoints.filter((_, i) => i !== datapointIndex);
    setLocalDatapoints(updatedDatapoints);
  };

  return (
    <div className="subcategory">
      <input
        type="text"
        value={name}
        placeholder="Subcategory Name"
        onChange={(e) => updateName(index, e.target.value)}
      />
      <button onClick={addDatapoint}>Add Datapoint</button>
      <button onClick={() => removeSubcategory(index)}>Remove Subcategory</button>

      {localDatapoints.map((datapoint, datapointIndex) => (
        <Datapoint
          key={datapointIndex}
          index={datapointIndex}
          name={datapoint.name}
          type={datapoint.type}
          isMandatory={datapoint.isMandatory}
          updateDatapoint={updateDatapoint}
          removeDatapoint={removeDatapoint}
        />
      ))}
    </div>
  );
};

export default Subcategory;
