import React, { useState,useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Forms from './forms/Forms';
import Summary from './Summary';

function TabNavigation({ selectedStage,patient_id }) {
  const [activeKey, setActiveKey] = useState(''); // Controls the active tab
  const [formData, setFormData] = useState({});
  const [tabsData, setTabsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedDatapoint, setHighlightedDatapoint] = useState(null);
  const fetchFormData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5002/api/subcategories?category_id=${selectedStage}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data.subcategories)
      setTabsData(data.subcategories);
      if (data.length > 0) setActiveKey(data.subcategories[0].name);
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  useEffect(() => {
    if (selectedStage) {
      fetchFormData();
    }
  }, [selectedStage]);
  

  const saveFormData = (tabName, updatedData) => {
    setFormData((prevData) => ({
      ...prevData,
      [tabName]: updatedData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = [];

    // Iterate over tabsData and formData to construct submission payload
    tabsData.forEach((tab) => {
        const tabFormData = formData[tab.name] || {}; // Get form data for the current tab
        tab.datapoints.forEach((datapoint) => {
            const value = tabFormData[datapoint.name]; // Check if there's data for the datapoint
            if (value) {
                submissionData.push({
                    patient_id: patient_id,
                    datapoint_id: datapoint.id,
                    data: value
                });
            }
        });
    });
    console.log(submissionData);

    try {
        const response = await fetch('http://127.0.0.1:5002/api/patient_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData), // Send array of datapoints with data
        });
        const result = await response.json();
        alert("Data submitted successfully!", result);
    } catch (error) {
        console.error("Error submitting data:", error);
    }
};

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = [];
    tabsData.forEach((tab) => {
      tab.datapoints.forEach((datapoint) => {
        if (datapoint.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({ tabName: tab.name, datapoint });
        }
      });
    });
    setSearchResults(results);
  };

  const handleResultClick = (result) => {
    setActiveKey(result.tabName);
    setHighlightedDatapoint(result.datapoint.id); // Use datapoint ID for unique identification
    setSearchQuery(''); // Clear search query
    setSearchResults([]); // Clear search results
  };

  return (
    <div className="tab-navigation">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search datapoints..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((result, index) => (
              <li key={index} onClick={() => handleResultClick(result)}>
                {result.datapoint.name} (in {result.tabName})
              </li>
            ))}
          </ul>
        )}
      </div>
      <Tabs
        id="horizontal-tab-example"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)} // Updates the active tab state
        className="horizontal-tabs"
      >
        {tabsData.map((tab, index) => ( //className="tab-content"
          <Tab eventKey={tab.name} title={tab.name} key={index}>
            {activeKey === tab.name && (
                <div className="tab-c">
                <Forms
                  className = "forms"
                  datapoints={tab.datapoints}
                  tabName={tab.name}
                  saveFormData={saveFormData}
                  formData={formData[tab.name] || {}}
                  highlightedDatapoint={highlightedDatapoint}
                />
                <Summary
                className = "summary"
                  data={tab}
                  formData={formData[tab.name] || {}}
                  handleSubmit={handleSubmit}
                />
              </div>
            )}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default TabNavigation;
