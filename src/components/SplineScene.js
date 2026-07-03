import Spline from '@splinetool/react-spline';

export default function SplineScene({ sceneUrl, onLoad, isReady }) {
  return (
    <div className="spline-stage" aria-hidden={!isReady}>
      <div className="spline-stage__glow" />
      <Spline scene={sceneUrl} onLoad={onLoad} />
      {!isReady ? (
        <div className="spline-loader">
          <div className="spline-loader__ring" />
          <p>Loading interactive core</p>
        </div>
      ) : null}
    </div>
  );
}
