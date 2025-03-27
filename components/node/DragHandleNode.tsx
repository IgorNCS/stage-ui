// import { useRouter } from 'next/router';
import { position } from '@chakra-ui/react';
import { Background, ReactFlow, BackgroundVariant, Node, PanOnScrollMode, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';

function DragHandleNode(process?: any) {
  // const router = useRouter(); 
  const nodeStylePrincipal = {
    borderRadius: 5,
    padding: 15,
    fontSize: '20px',
    backgroundColor: 'rgb(234, 255, 41)',
    color: 'black',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const initialNodes = [
    { id: `process/${process?.process?.id}`, position: { x: 150, y: 50 }, data: { label: `${process?.process?.name}`, dragHandle: true }, draggable: false, style: nodeStylePrincipal, },
  ];

  const initialEdges: any[] = [];
  console.log(process);

  const subProcesses = process?.process?.subProcesses;
  const documentations = process?.process?.documentations;
  if (subProcesses && Array.isArray(subProcesses) && subProcesses.length > 0) {
    const nodeStyle = {
      borderRadius: 5,
      padding: 15,
      backgroundColor: 'rgb(79, 140, 255)',
      color: 'black',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };

    subProcesses.forEach((subProcess, index) => {
      const nodeId = `process/${subProcess.id}`;
      initialNodes.push({
        id: nodeId,
        position: { x: 150, y: 150 + (75 * index + 1) },
        data: { label: subProcess.name || `SubProcesso ${index + 1}`, dragHandle: true },
        draggable: false,
        style: nodeStyle,
      });

      const edgeStyle = {
        strokeWidth: 2,
        stroke: `linear-gradient(90deg, rgb(0, 243, 41),rgb(0, 243, 41))`,
        markerEnd: { type: 'arrowclosed', color: '#2193b0' },
      };

      if (index === 0) {
        initialEdges.push({ id: `e-process/${process?.process?.id}-${nodeId}`, source: `process/${process?.process?.id}`, target: nodeId, style: edgeStyle, animated: true, type: 'smoothstep', });
      } else {
        initialEdges.push({ id: `e-${subProcesses[index - 1].id}-${nodeId}`, source: subProcesses[index - 1].id, target: nodeId, style: edgeStyle, animated: true, type: 'smoothstep' });
      }
    });
  }
  console.log(documentations)

  if (documentations && Array.isArray(documentations) && documentations.length > 0) {
    const nodeStyle = {
      borderRadius: 5,
      padding: 15,
      backgroundColor: 'rgb(185, 79, 255)',
      color: 'black',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };

    documentations.forEach((documentation, index) => {
      const nodeId = `documentation/${documentation.id}`;
      initialNodes.push({
        id: nodeId,
        position: { x: 750, y: 50 + (100 * index + 1) },
        data: { label: documentation.name || `Documentação ${index + 1}`, dragHandle: true },
        draggable: false,
        style: nodeStyle,
        targetPosition: Position.Left,

      });

    const edgeStyle = {
      strokeWidth: 2,
      stroke: `linear-gradient(90deg, rgb(0, 243, 41),rgb(0, 243, 41))`,
      markerEnd: { type: 'arrowclosed', color: '#2193b0' },
    };


    initialEdges.push({
      id: `e-process/${process?.process?.id}-${nodeId}`,
      source: `process/${process?.process?.id}`,
      target: nodeId,
      style: edgeStyle,
      animated: true,

      sourcePosition: Position.Right,
      targetPosition: Position.Right,
    });


  });
}
const router = useRouter();



return (
  <ReactFlow
    defaultNodes={initialNodes}
    defaultEdges={initialEdges}
    panOnDrag={false}
    zoomOnScroll={false}
    preventConnecting={true}
    zoomActivationKeyCode={false}
    zoomOnPinch={false}
    zoomOnDoubleClick={false}
    onNodeClick={(event, node) => router.push(`/${node?.id}`)}
    // onNodeClick={(event, node) => console.log(node)}
    onEdgeClick={false}
    edgesReconnectable={false}
    onEdgesChange={false}
    onEdgeMouseEnter={false}
    onConnect={(params) => (params.source === params.target ? null : params)}
    panScrollMode={PanOnScrollMode.Vertical}
    panOnScroll={true}
  >
    <Background id="1" gap={10} color="#FFFFFF" variant={BackgroundVariant.Lines} />
  </ReactFlow>
);
}

export default DragHandleNode;