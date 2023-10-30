// @ts-nocheck
import React from "react";
import ReactFlow, {
   Panel,
} from 'reactflow';


export default Settings = () => {

return (
    <>
  <Panel position="topleft">
  <div>
    <label htmlFor="draggable">
      <input
        id="draggable"
        type="checkbox"
        checked={isDraggable}
        onChange={(event) => setIsDraggable(event.target.checked)}
        className="react-flow__draggable"
      />
      nodesDraggable
    </label>
  </div>
  <div>
    <label htmlFor="connectable">
      <input
        id="connectable"
        type="checkbox"
        checked={isConnectable}
        onChange={(event) => setIsConnectable(event.target.checked)}
        className="react-flow__connectable"
      />
      nodesConnectable
    </label>
  </div>
  <div>
    <label htmlFor="selectable">
      <input
        id="selectable"
        type="checkbox"
        checked={isSelectable}
        onChange={(event) => setIsSelectable(event.target.checked)}
        className="react-flow__selectable"
      />
      elementsSelectable
    </label>
  </div>
  <div>
    <label htmlFor="zoomonscroll">
      <input
        id="zoomonscroll"
        type="checkbox"
        checked={zoomOnScroll}
        onChange={(event) => setZoomOnScroll(event.target.checked)}
        className="react-flow__zoomonscroll"
      />
      zoomOnScroll
    </label>
  </div>
  <div>
    <label htmlFor="panonscroll">
      <input
        id="panonscroll"
        type="checkbox"
        checked={panOnScroll}
        onChange={(event) => setPanOnScroll(event.target.checked)}
        className="react-flow__panonscroll"
      />
      panOnScroll
    </label>
  </div>
  <div>
    <label htmlFor="panonscrollmode">
      <select
        id="panonscrollmode"
        value={panOnScrollMode}
        onChange={(event) => setPanOnScrollMode(event.target.value)}
        className="react-flow__panonscrollmode"
      >
        <option value="free">free</option>
        <option value="horizontal">horizontal</option>
        <option value="vertical">vertical</option>
      </select>
      panOnScrollMode
    </label>
  </div>
  <div>
    <label htmlFor="zoomondbl">
      <input
        id="zoomondbl"
        type="checkbox"
        checked={zoomOnDoubleClick}
        onChange={(event) => setZoomOnDoubleClick(event.target.checked)}
        className="react-flow__zoomondbl"
      />
      zoomOnDoubleClick
    </label>
  </div>
  <div>
    <label htmlFor="panOnDrag">
      <input
        id="panOnDrag"
        type="checkbox"
        checked={panOnDrag}
        onChange={(event) => setpanOnDrag(event.target.checked)}
        className="react-flow__panOnDrag"
      />
      panOnDrag
    </label>
  </div>
  <div>
    <label htmlFor="capturezoompaneclick">
      <input
        id="capturezoompaneclick"
        type="checkbox"
        checked={captureZoomClick}
        onChange={(event) => setCaptureZoomClick(event.target.checked)}
        className="react-flow__capturezoompaneclick"
      />
      capture onPaneClick
    </label>
  </div>
  <div>
    <label htmlFor="capturezoompanescroll">
      <input
        id="capturezoompanescroll"
        type="checkbox"
        checked={captureZoomScroll}
        onChange={(event) => setCaptureZoomScroll(event.target.checked)}
        className="react-flow__capturezoompanescroll"
      />
      capture onPaneScroll
    </label>
  </div>
  <div>
    <label htmlFor="captureelementclick">
      <input
        id="captureelementclick"
        type="checkbox"
        checked={captureElementClick}
        onChange={(event) => setCaptureElementClick(event.target.checked)}
        className="react-flow__captureelementclick"
      />
      capture onElementClick
    </label>
  </div>
</Panel>
</>
)
}