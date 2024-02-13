import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import './Lab.scss';

function ScenarioInfo() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const [openExecutions, setOpenExecutions] = useState({});
  const [openNodeDetails, setOpenNodeDetails] = useState({});

  const { scenarios, loadScenario, deleteExecution } = useAppStore((state) => ({
    scenarios: state.scenarios,
    loadScenario: state.loadScenario,
    deleteExecution: state.deleteExecution,
  }));

  const scenario = scenarios ? scenarios[scenarioId] : null;

  const toggleExecutionDropdown = (executionId) => {
    setOpenExecutions((prev) => ({
      ...prev,
      [executionId]: !prev[executionId],
    }));
  };

  const toggleNodeDetail = (executionId, nodeId) => {
    const key = `${executionId}-${nodeId}`;
    setOpenNodeDetails((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="scenario-container main-font">
      <h1>Scenario {scenarioId}</h1>
      
      <h2>Executions</h2>
      {scenario && scenario.executions && Object.keys(scenario.executions).length > 0 ? (
        Object.entries(scenario.executions).map(([executionId, executionData]) => (
          <div key={executionId} className="execution-section">
            <button className="dropdown-button flex items-center" onClick={() => toggleExecutionDropdown(executionId)}>
              <span className='flex justify-center items-center m-2' style={{width: '20px'}}>
                {openExecutions[executionId] ? '-' : '+'}
              </span>
              <span>Execution {executionId}</span>
            </button>

            {openExecutions[executionId] && (
              <div>
                <table className="node-table">
                  <thead>
                    <tr>
                      <th>Node ID</th>
                      <th>Node Type</th>
                      <th>Timestamp</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(executionData).map(([nodeId, nodeData]) => (
                      <React.Fragment key={nodeId}>
                        <tr>
                          <td>{nodeId}</td>
                          <td>{nodeData.nodeType}</td>
                          <td>{nodeData.timestamp}</td>
                          <td>
                            <button className="node-detail-toggle" onClick={() => toggleNodeDetail(executionId, nodeId)}>
                              {openNodeDetails[`${executionId}-${nodeId}`] ? <span>-</span> : <span>+</span>}
                            </button>
                          </td>
                        </tr>
                        {openNodeDetails[`${executionId}-${nodeId}`] && (
                          <tr className="node-execution-details-row">
                            <td colSpan="4">
                              <div className="node-execution-details">
                                {/* Dynamically render execution status data here */}
                                {nodeData.executionStatus?.inBlock && (
                                  <p>Transaction included at blockHash {nodeData.executionStatus.inBlock}</p>
                                )}
                                {nodeData.executionStatus?.finalized && (
                                  <p>Transaction finalized at blockHash {nodeData.executionStatus.finalized}</p>
                                )}
                                {nodeData.executionStatus?.error && (
                                  <p>Error: {nodeData.executionStatus.error}</p>
                                )}
                                {/* You can add more details based on what you store in your execution status */}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No executions for this scenario yet.</p>
      )}
    </div>
  );
}

export default ScenarioInfo;
