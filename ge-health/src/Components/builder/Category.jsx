import React, { useState } from 'react';
import Subcategory from './Subcategory';

const Category = ({ index, name, subcategories, updateName, removeCategory }) => {
  const [localSubcategories, setLocalSubcategories] = useState(subcategories);

  // Function to add a new subcategory
  const addSubcategory = () => {
    setLocalSubcategories([...localSubcategories, { name: '', datapoints: [] }]);
  };

  // Function to update subcategory name
  const updateSubcategory = (subIndex, newName) => {
    const updatedSubcategories = [...localSubcategories];
    updatedSubcategories[subIndex].name = newName;
    setLocalSubcategories(updatedSubcategories);
  };

  // Function to remove a subcategory
  const removeSubcategory = (subIndex) => {
    const updatedSubcategories = localSubcategories.filter((_, i) => i !== subIndex);
    setLocalSubcategories(updatedSubcategories);
  };

  return (
    <div className="category">
      <input
        type="text"
        value={name}
        placeholder="Category Name"
        onChange={(e) => updateName(index, e.target.value)}
      />
      <button onClick={addSubcategory}>Add Subcategory</button>
      <button onClick={() => removeCategory(index)}>Remove Category</button>

      {localSubcategories.map((subcategory, subIndex) => (
        <Subcategory
          key={subIndex}
          index={subIndex}
          name={subcategory.name}
          datapoints={subcategory.datapoints}
          updateName={updateSubcategory}
          removeSubcategory={removeSubcategory}
        />
      ))}
    </div>
  );
};

export default Category;
