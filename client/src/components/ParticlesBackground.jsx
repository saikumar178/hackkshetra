import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Detect dark mode from HTML <html className="dark">
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: { value: "transparent" } },
        fullScreen: { enable: false },
        fpsLimit: 60,

        particles: {
          color: { value: isDark ? "#ffffff" : "#000000" },

          links: {
            enable: true,
            color: isDark ? "#ffffff" : "#000000",
            distance: 140,
            opacity: 0.2,
            width: 1,
          },

          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            outModes: { default: "bounce" },
          },

          number: {
            value: 60,
            density: {
              enable: true,
              area: 900
            }
          },

          opacity: { value: 0.25 },
          size: { value: { min: 1, max: 3 } },
          shape: { type: "circle" }
        },

        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            resize: true
          },
          modes: {
            grab: {
              distance: 160,
              links: { opacity: 0.4 }
            }
          }
        },

        detectRetina: true,
      }}
      className="absolute inset-0 -z-10 pointer-events-none"
    />
  );
}
