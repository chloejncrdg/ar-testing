import { Suspense, useState } from 'react';
import './App.css';

// DATA
import data from './data.json';

// COMPONENT
import Tool from './Tool';

// 3D
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Resize } from '@react-three/drei';

// XR
import { XR, createXRStore, XRDomOverlay } from '@react-three/xr';

function App() {
  const { tools } = data;

  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [canvasKey, setCanvasKey] = useState(0);

  const store = createXRStore();

  const handleToolChange = (event) => {
    const toolId = event.target.value;
    const tool = tools.find((tool) => tool.id.toString() === toolId);
    setSelectedTool(tool);
    setCanvasKey(Date.now());
  };

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setCanvasKey(Date.now());
  };

  return (
    <div className="px-12 md:px-56">
      <div className="p-12">
        <h1 className="flex justify-center align-center text-3xl font-bold">AR Test Functionality</h1>
      </div>
      <div className="flex flex-col md:flex md:flex-row justify-center gap-5">
        <div className="hidden md:flex md:flex-col py-2 w-1/4">
          <h1>Select tools:</h1>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="mx-3 my-1 border border-gray-300 px-3 py-1 rounded-sm"
            >
              {tool.title}
            </button>
          ))}
        </div>
        <div className="md:hidden">
          <select
            onChange={handleToolChange}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 font-sf-regular"
            value={selectedTool ? selectedTool.id : ''}
          >
            {tools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.title}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-3/4 bg-gray-200 h-[60vh] md:h-[80vh]">
          {selectedTool ? (
            selectedTool.modelPath ? (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-full font-sf-regular">
                    Loading model...
                  </div>
                }
              >
                <button onClick={() => store.enterAR()}>Enter AR</button>
                <Canvas key={canvasKey}>
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    castShadow
                    position={[1, 10, 1]}
                    intensity={4}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                    shadow-camera-near={0.1}
                  />
                  <directionalLight position={[1, -10, -1]} intensity={2} />
                  <directionalLight position={[-1, 0, 1]} intensity={1.3} color="#D68270" />
                  <OrbitControls />
                  <Resize>
                    <XR store={store}>
                    <Tool modelPath={selectedTool.modelPath} />
                      <XRDomOverlay className="absolute inset-0">
                        <button
                          onClick={() => store.destroy()}
                          className="absolute bottom-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          Exit AR
                        </button>
                      </XRDomOverlay>
                    </XR>
                  </Resize>
                </Canvas>
              </Suspense>
            ) : (
              <div className="text-center text-gray-700 font-sf-regular">
                3D model of {selectedTool.title} not yet available
              </div>
            )
          ) : (
            <div className="text-center text-gray-700">No tool selected</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
