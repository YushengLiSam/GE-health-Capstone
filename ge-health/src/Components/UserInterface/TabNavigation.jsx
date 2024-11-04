import React, { useState,useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import FHRForm from './forms/FHRForm';
import ContractionsForm from './forms/ContractionsForm';
import PatientCareForm from './forms/PatientCareForm';

function TabNavigation({ selectedStage }) {
  const [activeKey, setActiveKey] = useState(''); // Controls the active tab
  const [tabsData, setTabsData] = useState([{
    "name": "Contractions",
    "datapoints": [
      {
        "name": "Contraction frequency",
        "datatype": "Numeric",
        "inputType": "Textbox",
        "isMandatory": true
      },
      {
        "name": "Quality",
        "datatype": "List",
        "inputType": "Dropdown",
        "isMandatory": false,
        "listItems": ["Mild", "Moderate", "Strong"]
      }
    ]
  },
  {
    "name": "Patient Care",
    "datapoints": [
      {
        "name": "Name",
        "datatype": "String",
        "inputType": "Textbox",
        "isMandatory": false
      }
    ]
  }]);
  const fetchFormData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/get_subcategories`, {
        method: 'POST', // Adjust to POST if the server requires stage in the request body
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stage: selectedStage }) // Send stage in the request body
      });
      const data = await response.json();
      console.log(data)
      setTabsData(data);
      if (data.length > 0) setActiveKey(data[0].name);
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };
  useEffect(() => {
    if (selectedStage) {
      fetchFormData();
    }
  }, [selectedStage]);
  
  console.log(selectedStage);
  return (
    <div className="tab-navigation">
      <Tabs
        id="horizontal-tab-example"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)} // Updates the active tab state
        className="horizontal-tabs"
      >
        {tabsData.map((tab, index) => (
          <Tab eventKey={tab.name} title={tab.name} key={index}>
            {activeKey === tab.name && (
                <Forms datapoints={tab.datapoints} />
            )}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default TabNavigation;
