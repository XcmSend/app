import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../components/Bagpipes/hooks';
import './Lab.scss';
import { EyeIcon } from '../../components/Icons/icons';
import { deleteExecutionAsync, loadScenarioAsync} from '../../store/AsyncHelpers';
import ScenarioService from '../../services/ScenarioService';

function ScenarioInfo() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();

  const { scenarios, loadScenario, deleteExecution, deleteScenario } = useAppStore((state) => ({
    scenarios: state.scenarios,
    loadScenario: state.loadScenario,
    deleteExecution: state.deleteExecution,
    deleteScenario: state.deleteScenario,
  }));

  
  const scenario = scenarios ? scenarios[scenarioId] : null;

  // Inside your component
  const handleLoadScenario = async (scenarioId, executionId) => {
    const loadSuccess = await loadScenarioAsync(scenarioId, executionId);
    if (loadSuccess) {
      loadScenario(scenarioId, executionId);
      navigate('/builder');
    } else {
      // Handle the error case here
    }
  };

  return (
    <div className="scenario-container main-font">
      <h1>Scenario {scenarioId}</h1>
      
      <h2>Executions</h2>
      <table className="executions-table">
        <thead>
          <tr>
            <th>Execution ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {scenario && scenario.executions && Object.keys(scenario.executions).length > 0 ? (
            Object.entries(scenario.executions).map(([executionId, executionData]) => (
              <tr key={executionId}>
                <td>{executionId}</td>
                <td>
                  <button className="button flex items-center" onClick={() => handleLoadScenario(scenarioId, executionId)}>
                    <EyeIcon />
                    View
                  </button>
                  <button 
                    className="button delete-button flex items-center" 
                    onClick={() => deleteExecutionAsync(scenarioId, executionId)}
                  >
                    Delete
                  </button>
                </td>
             
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No executions for this scenario yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ScenarioInfo;
