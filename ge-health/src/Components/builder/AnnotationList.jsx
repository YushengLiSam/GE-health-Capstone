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

  // Handle delete for category
  const handleDeleteCategory = async (categoryName) => {
    try {
      const userID = sessionStorage.getItem("userID");
      const response = await fetch(`http://127.0.0.1:5002/api/categories`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, user_id: userID }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete category. Status: ${response.status}`);
      }

      setAnnotations((prevAnnotations) =>
        prevAnnotations.filter((annotation) => annotation.category !== categoryName)
      );
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  // Handle delete for subcategory
  const handleDeleteSubcategory = async (categoryName, subcategoryName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5002/api/subcategories`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: categoryName, name: subcategoryName }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete subcategory. Status: ${response.status}`);
      }

      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) => {
          if (annotation.category === categoryName) {
            annotation.subcategory = annotation.subcategory.filter(
              (sub) => sub !== subcategoryName
            );
          }
          return annotation;
        })
      );
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      alert("Failed to delete subcategory. Please try again.");
    }
  };

  // Handle delete for datapoint
  const handleDeleteDatapoint = async (categoryName, subcategoryName, datapoint) => {
    try {
      const response = await fetch(`http://127.0.0.1:5002/api/datapoints`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_name: categoryName,
          subcategory_name: subcategoryName,
          name: datapoint,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete datapoint. Status: ${response.status}`);
      }

      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) => {
          if (annotation.category === categoryName) {
            annotation.subcategory = annotation.subcategory.map((sub) => {
              if (sub.name === subcategoryName) {
                sub.datapoints = sub.datapoints.filter((dp) => dp !== datapoint);
              }
              return sub;
            });
          }
          return annotation;
        })
      );
    } catch (err) {
      console.error("Error deleting datapoint:", err);
      alert("Failed to delete datapoint. Please try again.");
    }
  };

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {annotations.map((annotation, index) => (
              <tr key={index}>
                <td>
                  {annotation.category}
                  <button
                    className="remove-button"
                    onClick={() => handleDeleteCategory(annotation.category)}
                  >
                    Remove
                  </button>
                </td>
                <td>
                  {annotation.subcategory}
                  <button
                    className="remove-button"
                    onClick={() =>
                      handleDeleteSubcategory(annotation.category, annotation.subcategory)
                    }
                  >
                    Remove
                  </button>
                </td>
                <td>
                  {annotation.datapoint}
                  <button
                    className="remove-button"
                    onClick={() =>
                      handleDeleteDatapoint(
                        annotation.category,
                        annotation.subcategory,
                        annotation.datapoint
                      )
                    }
                  >
                    Remove
                  </button>
                </td>
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
