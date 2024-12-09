import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AnnotationBuilder.module.css';
import './AnnotationList.css';

function AnnotationList() {
  const [categories, setCategories] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        const response = await fetch(`http://127.0.0.1:5002/api/categories?user_id=${userID}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data.categories || []);
        if (data.categories.length > 0) {
          // Fetch subcategories for the first category by default
          fetchSubcategories(data.categories[0].id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories for a specific category
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5002/api/subcategories?category_id=${categoryId}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Error fetching subcategories for category ${categoryId}`);
      }

      const data = await response.json();
      setSubcategoriesData((prev) => ({
        ...prev,
        [categoryId]: data.subcategories || [],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
    // if (!expandedCategories[categoryId]) {
    //   fetchSubcategories(categoryId);
    // }
  };

  // Toggle subcategory expansion
  const toggleSubcategory = (categoryId, subcategoryId) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [`${categoryId}-${subcategoryId}`]: !prev[`${categoryId}-${subcategoryId}`],
    }));
  };

  // Handle delete for category
  const handleDeleteCategory = async (category_id) => {
    try {
      
      const userID = sessionStorage.getItem("userID");
      console.log(JSON.stringify({ id:category_id, user_id: userID }))
      const response = await fetch(`http://127.0.0.1:5002/api/categories`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id:category_id, user_id: userID }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete category. Status: ${response.status}`);
      }

      setCategories((prevcategories) =>
        prevcategories.filter((annotation) => annotation.id !== category_id)
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

      setCategories((prevcategories) =>
        prevcategories.map((annotation) => {
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

      setCategories((prevcategories) =>
        prevcategories.map((annotation) => {
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
      <h1>Annotation List</h1>
      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : categories.length === 0 ? (
        <div className="no-annotations">
          No annotations available. Try using the{' '}
          <Link to="/admin/annotation-builder" className="annotation-link">
            Annotation Builder
          </Link>{' '}
          to customize your own annotations.
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="category">
            <div className="categoryRow">
              {/* Collapse/Expand button for category */}
              <button
                className={`caretButton ${expandedCategories[category.id] ? 'expanded' : ''}`}
                onClick={() => toggleCategory(category.id)}
              >
                {expandedCategories[category.id] ? '▼' : '▲'}
              </button>
              <span>{category.name}</span>
            </div>
            {expandedCategories[category.id] &&
              subcategoriesData[category.id]?.map((subcategory) => (
                <div key={subcategory.id} className="subcategory">
                  <div className="subcategoryRow">
                    {/* Collapse/Expand button for subcategory */}
                    <button
                      className={`caretButton ${
                        expandedSubcategories[`${category.id}-${subcategory.id}`] ? 'expanded' : ''
                      }`}
                      onClick={() => toggleSubcategory(category.id, subcategory.id)}
                    >
                      {expandedSubcategories[`${category.id}-${subcategory.id}`] ? '▼' : '▲'}
                    </button>
                    <span>{subcategory.name}</span>
                  </div>
                  {expandedSubcategories[`${category.id}-${subcategory.id}`] &&
                    subcategory.datapoints?.map((datapoint) => (
                      <div key={datapoint.id} className="datapoint">
                        <span>{datapoint.name}</span>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
}

export default AnnotationList;