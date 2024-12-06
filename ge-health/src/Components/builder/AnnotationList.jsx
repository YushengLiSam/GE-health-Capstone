import React, { useState, useEffect } from 'react';
import './AnnotationList.css';

function AnnotationList() {
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    // Fetch annotations from a backend or local storage (example logic below)
    const storedAnnotations = JSON.parse(localStorage.getItem('annotations')) || [];
    setAnnotations(storedAnnotations);
  }, []);

  return (
    <div className="annotation-list">
      <h2>Annotation List</h2>
      {annotations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Datapoint</th>
            </tr>
          </thead>
          <tbody>
            {annotations.map((annotation, index) => (
              <tr key={index}>
                <td>{annotation.category}</td>
                <td>{annotation.subcategory}</td>
                <td>{annotation.datapoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-annotations">
          No annotations have been set. Please go to the Annotation Builder to set up annotations.
        </div>
      )}
    </div>
  );
}

export default AnnotationList;
