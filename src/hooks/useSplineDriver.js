import { useEffect, useRef } from 'react';

const SCENE_URL = 'https://prod.spline.design/Klk6kydm2OqssauT/scene.splinecode';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(current, target, alpha) {
  return current + (target - current) * alpha;
}

function bindSceneObjects(app) {
  const allObjects = app.getAllObjects?.() ?? [];

  const findByName = (name) =>
    app.findObjectByName(name) ||
    allObjects.find((object) => object.name === name);

  return {
    app,
    sphere: findByName('Sphere'),
    particles: findByName('Particles'),
    particleForce: findByName('Particle Force'),
    particleEmitter: findByName('Particle Emitter 2'),
    group: findByName('Sphere + Particles'),
    light: findByName('Directional Light') || findByName('DirectionalLightw'),
    allObjects,
  };
}

export function useSplineDriver(metrics, status) {
  const sceneRef = useRef(null);
  const bindingsRef = useRef(null);
  const frameRef = useRef(null);
  const motionRef = useRef({
    rotation: 0,
    scale: 1,
    intensity: 1,
    particleIntensity: 1,
    wind: 0,
  });

  const handleLoad = (app) => {
    sceneRef.current = app;
    bindingsRef.current = bindSceneObjects(app);

    try {
      app.setVariable?.('pulse', 0);
      app.setVariable?.('momentum', 0);
      app.setVariable?.('volatility', 0);
    } catch {
      // Scene variables are optional; object transforms still drive the effect.
    }
  };

  useEffect(() => {
    const animate = () => {
      const bindings = bindingsRef.current;
      const motion = motionRef.current;

      if (bindings?.app && metrics) {
        const liveWeight = status === 'live' ? 1 : 0.35;
        const momentum = metrics.momentum * liveWeight;
        const volatility = metrics.volatility * liveWeight;
        const pulse = metrics.pulse * liveWeight;
        const wind = clamp(metrics.weather.windSpeed / 30, 0, 1) * liveWeight;
        const temperature = metrics.weather.temperature;

        motion.rotation = lerp(motion.rotation, 0.004 + volatility * 0.02 + Math.abs(momentum) * 0.01, 0.06);
        motion.scale = lerp(motion.scale, 1 + pulse * 0.18 + Math.abs(momentum) * 0.08, 0.08);
        motion.intensity = lerp(motion.intensity, 0.85 + volatility * 1.4 + pulse * 0.5, 0.07);
        motion.particleIntensity = lerp(
          motion.particleIntensity,
          0.7 + volatility * 1.8 + wind * 0.9,
          0.08
        );
        motion.wind = lerp(motion.wind, wind, 0.05);

        const { sphere, group, light, particleForce, particles } = bindings;

        if (sphere) {
          sphere.rotation.y += motion.rotation * (momentum >= 0 ? 1 : -1);
          sphere.rotation.x = lerp(sphere.rotation.x, momentum * 0.35, 0.04);
          const uniformScale = motion.scale;
          sphere.scale.x = uniformScale;
          sphere.scale.y = uniformScale;
          sphere.scale.z = uniformScale;
        }

        if (group) {
          group.rotation.z = lerp(group.rotation.z, momentum * 0.25, 0.03);
          group.position.y = lerp(group.position.y, pulse * 12 - 6, 0.04);
        }

        if (light) {
          light.intensity = motion.intensity;
          light.rotation.y += 0.002 + volatility * 0.01;
        }

        if (particleForce) {
          particleForce.intensity = motion.particleIntensity;
          particleForce.rotation.y += motion.wind * 0.03;
        }

        if (particles) {
          particles.intensity = motion.particleIntensity;
          particles.rotation.x = lerp(particles.rotation.x, wind * 0.6, 0.04);
        }

        try {
          bindings.app.setVariable?.('pulse', pulse);
          bindings.app.setVariable?.('momentum', momentum);
          bindings.app.setVariable?.('volatility', volatility);
          bindings.app.setVariable?.('temperature', temperature);
        } catch {
          // Ignore missing scene variables.
        }

        if (pulse > 0.72 && Math.random() < 0.02) {
          bindings.app.emitEvent?.('mouseHover', 'Sphere');
        }
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [metrics, status]);

  return {
    sceneUrl: SCENE_URL,
    handleLoad,
    sceneRef,
  };
}
