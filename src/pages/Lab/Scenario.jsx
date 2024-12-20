import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import { renderNodeDetails } from './utils/renderNodeDetails';
import './Lab.scss';

import ScenarioService from '../../services/ScenarioService';

function ScenarioInfo() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const [openExecutions, setOpenExecutions] = useState({});
  const [openNodeDetails, setOpenNodeDetails] = useState({});
  const [threadbagLogs, setThreadbagLogs] = useState(null);
  const [threadbagTx, setThreadbagTx] = useState(null);

  const { scenarios } = useAppStore((state) => ({
    scenarios: state.scenarios,
  }));


 // const th_logs = await ScenarioService.fetchPersistedScenarioLogs(); 
 // const th_tx = await ScenarioService.fetchPersistedScenarioMempool();
  useEffect(() => {
    const fetchThreadbagData = async () => {
      try {
        const api_scenario_id = await ScenarioService.get_api_scenario_id(scenarioId);
        
        const [logs, tx] = await Promise.all([
          ScenarioService.fetchPersistedScenarioLogs(api_scenario_id),
          ScenarioService.fetchPersistedScenarioMempool(api_scenario_id)
        ]);
        
        setThreadbagLogs(logs);
        setThreadbagTx(tx);
        console.log(`[ScenarioInfo 0] th_logs: ${logs} th_tx: ${tx}`);
      } catch (error) {
        console.error('Error fetching threadbag data:', error);
        // Handle error state if needed
      }
    };

    fetchThreadbagData();
  }, []); // Empty dependency array means this runs once on mount

  const parsedLogs = threadbagLogs ? JSON.parse(threadbagLogs) : null;

  console.log(`[ScenarioInfo] th_logs result: ${threadbagLogs} threadbagTx: ${threadbagTx}`);

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
    <div className="scenario-container">
       <h1 className=''>Scenario: <span className='scenario-title'>{scenario.name}</span> </h1>
       <h2 className='scenario-id-monspace'>id: {scenarioId}</h2>
      <br></br>
      <h2>Executions</h2>
      {scenario && scenario.executions && Object.keys(scenario.executions).length > 0 ? (
        Object.entries(scenario.executions).map(([executionId, executionData]) => (
          <div key={executionId} className="execution-section">
            <button className="dropdown-button flex items-center" onClick={() => toggleExecutionDropdown(executionId)}>
              <span className='flex justify-center items-center m-2' style={{width: '20px'}}>
                {openExecutions[executionId] ? '-' : '+'}
              </span>
              <span> {executionId}</span>
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
                                {renderNodeDetails(nodeData)}
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
<h2>Persistant Threadbag Executions</h2>
      <div className="threadbag-logs">
        {parsedLogs ? (
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <h3 className="text-lg font-semibold mb-2">
              Status: {parsedLogs.success ? 
                <span className="text-green-600">Success</span> : 
                <span className="text-red-600">Failed</span>
              }
            </h3>
            {parsedLogs.result && parsedLogs.result.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Execution Log:</h4>
                <ul className="list-none space-y-1">
                  {parsedLogs.result.map((log, index) => (
                    <li 
                      key={index}
                      className="bg-white p-2 rounded border border-gray-200 font-mono text-sm"
                    >
                      {log}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-600">No logs available</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Loading threadbag logs...</p>
        )}
      </div>


<h2>Persistant Threadbag Generated transactions</h2>
<div className="threadbag-transactions">
        {threadbagTx ? (
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            {JSON.parse(threadbagTx).mempool.length > 0 ? (
              <ul className="space-y-2">
                {JSON.parse(threadbagTx).mempool.map((tx, index) => (
                  <li key={index} className="bg-white p-2 rounded border border-gray-200">
                    {JSON.stringify(tx, null, 2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No transactions in mempool</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Loading transactions...</p>
        )}
      </div>

    </div>

  
  );
}

export default ScenarioInfo;
