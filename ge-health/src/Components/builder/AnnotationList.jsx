import React, { useState, useEffect } from 'react';
import './AnnotationList.css';

function AnnotationList() {
  const [annotations, setAnnotations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch annotations from the API
    const fetchAnnotations = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        const response = await fetch(`http://127.0.0.1:5002/api/categories?user_id=${userID}`, {
          method: 'GET', 
        });

        if (!response.ok) {
          throw new Error(`Error fetching annotations: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Annotations are: ", data);
        setAnnotations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnotations();
  }, []);

  return (
    <div className="annotation-list">
      <h2>Annotation List</h2>
      {loading ? (
        <div className="loading">Loading annotations...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : annotations.length > 0 ? (
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
