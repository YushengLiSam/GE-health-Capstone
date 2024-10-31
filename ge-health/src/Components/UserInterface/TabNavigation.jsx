import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Forms from './forms/Forms';
import ContractionsForm from './forms/ContractionsForm';
import PatientCareForm from './forms/PatientCareForm';

function TabNavigation() {
  const [activeKey, setActiveKey] = useState('fhr'); // Controls the active tab

  return (
    <div className="tab-navigation">
      <Tabs
        id="horizontal-tab-example"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)} // Updates the active tab state
        className="horizontal-tabs"
      >
        <Tab eventKey="fhr" title="FHR A" >
          {activeKey === 'fhr' && <Forms />} {/* Render only when active */}
        </Tab>
        <Tab eventKey="contractions" title="Contractions" >
          {activeKey === 'contractions' && <ContractionsForm />} {/* Render only when active */}
        </Tab>
        <Tab eventKey="patient-care" title="Patient Care" >
          {activeKey === 'patient-care' && <PatientCareForm />} {/* Render only when active */}
        </Tab>
      </Tabs>
    </div>
  );
}

export default TabNavigation;
