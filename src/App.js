import { useState } from 'react';
import './App.css';
import DataPanel from './components/DataPanel';
import SplineScene from './components/SplineScene';
import { useLiveMetrics } from './hooks/useLiveMetrics';
import { useSplineDriver } from './hooks/useSplineDriver';

export default function App() {
  const { metrics, status, error, lastUpdated, refresh } = useLiveMetrics();
  const { sceneUrl, handleLoad } = useSplineDriver(metrics, status);
  const [sceneReady, setSceneReady] = useState(false);

  const onSceneLoad = (app) => {
    handleLoad(app);
    setSceneReady(true);
  };

  return (
    <div className="app">
      <SplineScene sceneUrl={sceneUrl} onLoad={onSceneLoad} isReady={sceneReady} />
      <div className="app__overlay">
        <DataPanel
          metrics={metrics}
          status={status}
          error={error}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
        />
      </div>
    </div>
  );
}
