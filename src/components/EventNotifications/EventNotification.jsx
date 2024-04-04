import React, { useRef, useState } from 'react';
import { useTippy } from '../../contexts/tooltips/TippyContext'; 
import FormHeader from '../Bagpipes/Forms/FormHeader';
import FormFooter from '../Bagpipes/Forms/FormFooter';
import './EventNotification.scss';

const CollapsibleSection = ({ title, content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleExpand = () => setIsExpanded(!isExpanded);
  
    return (
      <div>
        <div className="flex items-center">
        <span onClick={toggleExpand} className="p-1  cursor-pointer">{isExpanded ? '-' : '+'}</span>
          <strong>{title}</strong>
        </div>
        {isExpanded && (
          <div className="content">
            {typeof content === 'object' ? <pre>{JSON.stringify(content, null, 2)}</pre> : <span>{content}</span>}
          </div>
        )}
      </div>
    );
  };
  
  const EventDataPopup = ({ eventUpdates, onClose }) => {
    const { hideTippy } = useTippy();
  
    const handleCancel = () => {
      hideTippy();
      onClose();
    };
  
    return (
      <div className="eventDataPopup">
        <FormHeader onClose={handleCancel} title="Event Data" />
        <div className="eventData">
          {eventUpdates.map((update, index) => (
            <div className="eventUpdateSection" key={index}>
                 {/* <CollapsibleSection title="Event" content={update}> */}
              <CollapsibleSection title="Timestamp" content={update.timestamp} />
              <CollapsibleSection title="Status" content={`${update.status} ${update.statusText}`} />
              <CollapsibleSection title="Headers" content={update.headers} />
              <CollapsibleSection title="Cookies" content={update.cookies} />
              <CollapsibleSection title="Data" content={update.eventData} />
              {/* </CollapsibleSection> */}
            </div>
          ))}
        </div>
      </div>
    );
  };


const EventNotification = ({ nodeId, eventUpdates }) => {
    const notificationRef = useRef();
    const { showTippy } = useTippy();
    const [isEventDataPoppedUp, setEventDataPopup] = useState(false);
    const handleNotificationClick = (e) => {
        e.stopPropagation();  
      const rect = notificationRef.current.getBoundingClientRect();
      const calculatedPosition = {
        x: rect.right,
        y: rect.top
      };
  
      // Show the Tippy with event data on click
      showTippy('eventData', nodeId, notificationRef.current, <EventDataPopup eventUpdates={eventUpdates} onClose={handleCloseEventDataPopup} />, 'top-start');
    };

    const handleCloseEventDataPopup = () => {
        setEventDataPopup(false);
    };

  
    if (eventUpdates.length === 0) return null;

    return (
      <div 
        ref={notificationRef} 
        onClick={handleNotificationClick} 
        className="eventNotification"
      >
        {eventUpdates.length}
      </div>
    );
  };
  
  export default EventNotification;