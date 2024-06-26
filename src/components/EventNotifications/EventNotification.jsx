import React, { useRef, useState } from 'react';
import { useTippy } from '../../contexts/tooltips/TippyContext';
import FormHeader from '../Bagpipes/Forms/FormHeader';
import Toggle from '../Bagpipes/Forms/Toggle';

import './EventNotification.scss';
import { CopyBlock, dracula } from 'react-code-blocks';

const CollapsibleSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div>
      <div className="flex items-center">
        <span onClick={toggleExpand} className="p-1 cursor-pointer">{isExpanded ? '-' : '+'}</span>
        <strong>{title}</strong>
      </div>
      {isExpanded && (
        <div className="content">
          {typeof content === 'object' ? renderDataContent(content) : <span>{content}</span>}
        </div>
      )}
    </div>
  );
};

const renderDataContent = (data) => {
  if (typeof data !== 'object' || data === null) {
    return <span>{data}</span>;
  }

  return Object.entries(data).map(([key, value], index) => (
    <div key={index} className="ml-4">
      <CollapsibleSection title={key} content={value} />
    </div>
  ));
};

const EventDataPopup = ({ nodeType, eventUpdates, onClose }) => {
  const { hideTippy } = useTippy();
  const [isRawView, setIsRawView] = useState(false);

  const handleCancel = () => {
    hideTippy();
    onClose();
  };

  const toggleView = () => {
    setIsRawView(!isRawView);
  };

  return (
    <div className="eventDataPopup">
      <FormHeader onClose={handleCancel} title="Event Data" />
      <div className="text-xs">
        <button className="text-xs button" onClick={toggleView}>
          {isRawView ? 'Show Nested View' : 'Show Raw JSON'}
        </button>
      </div>
      <div className="eventData">
        {eventUpdates.map((update, index) => (
          <div className="eventUpdateSection" key={index}>
            {isRawView ? (
              <><div className="flex items-center mb-2">
              <strong>Response [{index}]</strong>
            </div>
              <CopyBlock
                text={JSON.stringify(update, null, 2)}
                language="json"
                showLineNumbers={false}
                // theme={light}
                customStyle={{
                  borderRadius: '5px',
                  marginBottom: '15px',
                  padding: '5px',
                  backgroundColor: '#f5f5f5',
                  overflow: 'auto',
                  maxWidth: '100%',
                }}
              />
              </>
            ) : (
              <CollapsibleSection title={`Response [${index}]`} content={update} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EventNotification = ({ nodeId, nodeType, eventUpdates }) => {
  const notificationRef = useRef();
  const { showTippy } = useTippy();
  const [isEventDataPoppedUp, setEventDataPopup] = useState(false);

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    const rect = notificationRef.current.getBoundingClientRect();
    const calculatedPosition = {
      x: rect.right,
      y: rect.top,
    };

    showTippy(
      'eventData',
      nodeId,
      notificationRef.current,
      <EventDataPopup nodeType={nodeType} eventUpdates={eventUpdates} onClose={handleCloseEventDataPopup} />,
      'top-start'
    );
  };

  const handleCloseEventDataPopup = () => {
    setEventDataPopup(false);
  };

  const hasError = eventUpdates.some((update) => update.data && update.data.error);
  console.log('eventUpdates has Error', hasError, eventUpdates);

  if (eventUpdates.length === 0) return null;

  return (
    <div
      ref={notificationRef}
      onClick={handleNotificationClick}
      className={`eventNotification ${hasError ? 'error' : 'success'}`}
    >
      {eventUpdates.length}
    </div>
  );
};

export default EventNotification;
