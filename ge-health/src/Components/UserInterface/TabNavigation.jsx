import React, { useState,useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Forms from './forms/Forms';
import Summary from './Summary';

function TabNavigation({ selectedStage,patient_id }) {
  const [activeKey, setActiveKey] = useState(''); // Controls the active tab
  const [formData, setFormData] = useState({});
  const [tabsData, setTabsData] = useState([]);
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

  return (
    <div className="tab-navigation">
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
