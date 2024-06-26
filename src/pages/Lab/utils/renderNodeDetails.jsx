import React from 'react';

// Helper to safely access nested properties
const getSafe = (fn) => {
  try {
    return fn();
  } catch (e) {
    console.error('Failed to access data:', e);
    return undefined;
  }
};

// Function to render each key-value pair for chainQuery node data
const renderChainQueryData = (data) => {
  if (!data) { // Adding this check to handle null or undefined data
    return <tr><td colSpan="2">No data available</td></tr>;
  }
  return Object.entries(data).map(([key, value], index) => (
    <tr key={index}>
      <td>{key}</td>
      <td>{JSON.stringify(value)}</td>
    </tr>
  ));
};

// Main rendering function
export const renderNodeDetails = (nodeData) => {
  console.log(`[renderNodeDetails] Node data:`, nodeData);

  const eventUpdates = getSafe(() => nodeData.responseData.eventUpdates);
  if (!eventUpdates || eventUpdates.length === 0) {
    return <div>Error: No event updates available or data is malformed.</div>;
  }

  switch (nodeData.nodeType) {
    case 'chainQuery':
      return (
        <table>
          <thead>
            <tr>
              <th>Detail</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {eventUpdates.map((event, index) => 
              renderChainQueryData(getSafe(() => event.eventData), index)
            )}
          </tbody>
        </table>
      );
    case 'chainTx':
      return (
        <table>
          <thead>
            <tr>
              <th>Detail</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {eventUpdates.map((event, index) => 
              renderChainQueryData(getSafe(() => event.eventData), index)
            )}
          </tbody>
        </table>
      );

    default:
      // Handle other nodeTypes or general case
      return (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {eventUpdates.map((event, index) => (
              <tr key={index}>
                <td>{event.timestamp}</td>
                <td>{event.eventData ? JSON.stringify(event.eventData) : 'No event data'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
};
