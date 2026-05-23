import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function NeuralParticles() {
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="immersive-particles"
      init={init}
      className="absolute inset-0"
      options={{
        fullScreen: false,
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          color: {
            value: ['#00D4FF', '#7C3AED', '#A855F7'],
          },
          links: {
            color: '#00D4FF',
            distance: 160,
            enable: true,
            opacity: 0.12,
            width: 1,
            triangles: {
              enable: true,
              opacity: 0.015,
              color: '#00D4FF',
            },
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            outModes: { default: 'bounce' },
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            density: { enable: true, area: 600 },
            value: 80,
          },
          opacity: {
            value: { min: 0.15, max: 0.5 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: { type: 'circle' },
          size: {
            value: { min: 1, max: 3.5 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.5,
              sync: false,
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ['grab', 'repulse'],
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180,
              links: { opacity: 0.35, color: '#00D4FF' },
            },
            repulse: {
              distance: 100,
              speed: 0.5,
              factor: 1,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
