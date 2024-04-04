 import React from 'react'; 
 
 // Function to render node-specific details based on nodeType
  export const renderNodeDetails = (nodeData) => {
    switch (nodeData.nodeType) {
      case 'action':
        return (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Block Hash</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {nodeData.responseData?.eventUpdates?.map((event, index) => (
                <React.Fragment key={index}>
                  {event.inBlock && (
                    <tr>
                      <td>In Block</td>
                      <td>{event.inBlock}</td>
                      <td>{event.timestamp}</td>
                    </tr>
                  )}
                  {event.finalized && (
                    <tr>
                      <td>Finalized</td>
                      <td>{event.finalized}</td>
                      <td>{event.timestamp}</td>
                    </tr>
                  )}
                  {event.error && (
                    <tr>
                      <td>Error</td>
                      <td colSpan="2">{event.error}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        );
        case 'http':
      return (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {nodeData.responseData?.eventUpdates?.map((event, index) => (
              <tr key={index}>
                <td>{event.timestamp}</td>
                <td>{event.eventData}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      case 'webhook':
      // Add case for 'webhook' nodes
      return (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Data</th>
            </tr>
          </thead>
          <tbody>
            {nodeData.responseData?.eventUpdates?.map((event, index) => (
              <tr key={index}>
                <td>{event.timestamp}</td>
                <td>
                  <div>Query: {JSON.stringify(event.eventData.query)}</div>
                  <div>Method: {event.eventData.method}</div>
                  <div>Created At: {event.eventData.createdAt}</div>
                  {/* Additional details as needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
      default:
        return <p>No execution details available for this node type.</p>;
    }
  };