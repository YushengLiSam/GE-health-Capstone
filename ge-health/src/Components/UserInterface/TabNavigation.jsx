import React, { useState,useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Forms from './forms/Forms';
import Summary from './Summary';

function TabNavigation({ selectedStage }) {
  const [activeKey, setActiveKey] = useState(''); // Controls the active tab
  const [formData, setFormData] = useState({});
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
<<<<<<< HEAD
   const fetchFormData = async () => {
     try {
       const response = await fetch(`http://127.0.0.1:5000/api/categories`, {
         method: 'POST', // Adjust to POST if the server requires stage in the request body
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ stage: selectedStage }) // Send stage in the request body
       });
       const data = await response.json();
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
=======
  // const fetchFormData = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:5000/api/get_subcategories`, {
  //       method: 'POST', // Adjust to POST if the server requires stage in the request body
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ stage: selectedStage }) // Send stage in the request body
  //     });
  //     const data = await response.json();
  //     console.log(data)
  //     setTabsData(data);
  //     if (data.length > 0) setActiveKey(data[0].name);
  //   } catch (error) {
  //     console.error("Error fetching form data:", error);
  //   }
  // };
  // useEffect(() => {
  //   if (selectedStage) {
  //     fetchFormData();
  //   }
  // }, [selectedStage]);
>>>>>>> 8369fd271efcc422a1cdd3b4ad25bab121fc7890
  
  console.log(selectedStage);

  const saveFormData = (tabName, updatedData) => {
    setFormData((prevData) => ({
      ...prevData,
      [tabName]: updatedData
    }));
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
