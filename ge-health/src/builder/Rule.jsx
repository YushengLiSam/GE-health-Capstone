import React, { useState } from 'react';

const RuleBuilder = () => {
  const [rules, setRules] = useState(['Proceed to Active Labor stage', 'Proceed to Delivery stage']);
  const [newRule, setNewRule] = useState('');
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [conditions, setConditions] = useState([{ field: '', operator: '', value: '' }]);

  const handleAddRuleClick = () => {
    setShowNewRuleForm(true);
  };

  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule]);
      setNewRule('');
      setShowNewRuleForm(false);
    }
  };

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][field] = value;
    setConditions(updatedConditions);
  };

  const saveRules = () => {
    console.log('Saving rules:', rules, conditions);
    // Implement save logic here (e.g., POST to backend)
  };

  return (
    <div className="rule-builder">
      <h1>Rule Builder</h1>
      {!showNewRuleForm && (
        <button onClick={handleAddRuleClick}>Add Rule</button>
      )}

      {showNewRuleForm && (
        <div className="new-rule-form">
          <h2>New Rule</h2>

          <div className="rule-name">
            <label>Rule Name:</label>
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Enter rule name"
            />
          </div>

          <div className="conditions">
            {conditions.map((condition, index) => (
              <div key={index} className="condition">
                <input
                  type="text"
                  placeholder="Field"
                  value={condition.field}
                  onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                />
                <select
                  value={condition.operator}
                  onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="equals">equals</option>
                  <option value="not equals">not equals</option>
                  <option value="contains">contains</option>
                  <option value=">">{'>'}</option>
                  <option value="<">{'<'}</option>
                  <option value="=">{'='}</option>
                  <option value="is after">is after</option>
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                />
                <button onClick={() => setConditions(conditions.filter((_, i) => i !== index))}>-</button>
              </div>
            ))}
          </div>

          <button onClick={addCondition}>Add Condition</button>

          <div className="actions">
            <button onClick={addRule}>Save</button>
            <button onClick={() => setShowNewRuleForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="rules-list">
        {rules.map((rule, index) => (
          <div key={index} className="rule-item">
            <span>{rule}</span>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={saveRules}>Save All Rules</button>
      </div>
    </div>
  );
};

export default RuleBuilder;
