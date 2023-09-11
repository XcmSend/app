import { useState, useCallback, useEffect, useRef } from 'react';
import { Node, useKeyPress, useReactFlow, getConnectedEdges, KeyCode, Edge, XYPosition, useStore } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import useAppStore from '../../../store/useAppStore';


export function useCopyPaste<NodeData, EdgeData>() {
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 });
  const rfDomNode = useStore((state) => state.domNode);
  const { isModalVisible } = useAppStore();

  const { getNodes, setNodes, getEdges, setEdges, project } = useReactFlow<NodeData, EdgeData>();

  // Set up the paste buffers to store the copied nodes and edges.
  const [bufferedNodes, setBufferedNodes] = useState([] as Node<NodeData>[]);
  const [bufferedEdges, setBufferedEdges] = useState([] as Edge<EdgeData>[]);

  // initialize the copy/paste hook
  // 1. remove native copy/paste/cut handlers
  // 2. add mouse move handler to keep track of the current mouse position
  useEffect(() => {
    const events = ['cut', 'copy', 'paste'];

    if (rfDomNode) {
      const preventDefault = (e: Event) => {
        // Allow the paste event to propagate if the modal is open
        if (e.type === "paste" && isModalVisible) return;
        e.preventDefault();
    };
    
      const onMouseMove = (event: MouseEvent) => {
        const bounds = rfDomNode.getBoundingClientRect();
        mousePosRef.current = {
          x: event.clientX - (bounds?.left ?? 0),
          y: event.clientY - (bounds?.top ?? 0),
        };
      };

      for (const event of events) {
        rfDomNode.addEventListener(event, preventDefault);
      }

      rfDomNode.addEventListener('mousemove', onMouseMove);

      return () => {
        for (const event of events) {
          rfDomNode.removeEventListener(event, preventDefault);
        }

        rfDomNode.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [rfDomNode]);

  const copy = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter((edge) => {
      const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
      const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);

      return !(isExternalSource || isExternalTarget);
    });

    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);
  }, [getNodes, getEdges]);

  const cut = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter((edge) => {
      const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
      const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);

      return !(isExternalSource || isExternalTarget);
    });

    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);

    // A cut action needs to remove the copied nodes and edges from the graph.
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !selectedEdges.includes(edge)));
  }, [getNodes, setNodes, getEdges, setEdges]);

  const paste = useCallback(
    ({ x: pasteX, y: pasteY } = project({ x: mousePosRef.current.x, y: mousePosRef.current.y })) => {
      const minX = Math.min(...bufferedNodes.map((s) => s.position.x));
      const minY = Math.min(...bufferedNodes.map((s) => s.position.y));

      const now = Date.now();
      const newNodes: Node<NodeData>[] = bufferedNodes.map((node) => {
        const id = (node.type + '_' + uuidv4().substr(0, 6)).toLowerCase();
        const x = pasteX + (node.position.x - minX);
        const y = pasteY + (node.position.y - minY);
    
        return { ...node, id, position: { x, y } };
});

      const newEdges: Edge<EdgeData>[] = bufferedEdges.map((edge) => {
        const idParts = edge.id.split("_");
        const lastPart = idParts.pop() || "";
        const count = parseInt(lastPart);
    
        if (!isNaN(count)) {
            idParts.push((count + 1).toString());
        } else {
            idParts.push(lastPart, "1");
        }
    
        const id = idParts.join("_");
    
        const sourceParts = edge.source.split("_");
        sourceParts[sourceParts.length - 1] = idParts[idParts.length - 1] || "";
        const source = sourceParts.join("_");
    
        const targetParts = edge.target.split("_");
        targetParts[targetParts.length - 1] = idParts[idParts.length - 1] || "";
        const target = targetParts.join("_");
    
        return { ...edge, id, source, target };
      });

      setNodes((nodes) => [...nodes.map((node) => ({ ...node, selected: false })), ...newNodes]);
      setEdges((edges) => [...edges, ...newEdges]);
    },
    [bufferedNodes, bufferedEdges, project, setNodes, setEdges]
  );

  useShortcut(['Meta+x', 'Ctrl+x'], cut);
  useShortcut(['Meta+c', 'Ctrl+c'], copy);
  useShortcut(['Meta+v', 'Ctrl+v'], paste);

  return { cut, copy, paste, bufferedNodes, bufferedEdges };
}

function useShortcut(keyCode: KeyCode, callback: Function): void {
  const [didRun, setDidRun] = useState(false);
  const shouldRun = useKeyPress(keyCode);

  useEffect(() => {
    if (shouldRun && !didRun) {
      callback();
      setDidRun(true);
    } else {
      setDidRun(shouldRun);
    }
  }, [shouldRun, didRun, callback]);
}

export default useCopyPaste;
