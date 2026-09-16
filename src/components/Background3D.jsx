/**
 * COMPOSANT ARRIÈRE-PLAN 3D INTERACTIF (Background3D.jsx)
 * 
 * Moteur de rendu 3D temps réel par Canvas HTML5.
 * Projette un réseau de maillage géométrique tridimensionnel et des particules
 * lumineuses avec perspective, rotation fluide et réactivité au curseur.
 */

import React, { useEffect, useRef } from 'react';

export const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Paramètres 3D
    const fov = 400;
    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    // Création des sommets géométriques 3D (Sphère & Maillage)
    const pointsCount = 45;
    const points = [];
    const radius = Math.min(width, height) * 0.45;

    for (let i = 0; i < pointsCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.sqrt(pointsCount * Math.PI) * theta;

      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
        size: Math.random() * 2.5 + 1.5
      });
    }

    // Particules flottantes d'ambiance
    const ambientParticlesCount = 35;
    const ambientParticles = [];
    for (let i = 0; i < ambientParticlesCount; i++) {
      ambientParticles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 600 - 300,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1
      });
    }

    // Écouteur de redimensionnement
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Écouteur de mouvement de la souris (Parallaxe 3D)
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / width - 0.5) * 2;
      const mouseY = (e.clientY / height - 0.5) * 2;
      targetAngleY = mouseX * 0.5;
      targetAngleX = -mouseY * 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Boucle de rendu d'animation 3D à 60 FPS
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolation douce vers la position cible
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05 + 0.003; // Rotation continue

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const cx = width / 2;
      const cy = height / 2;

      // Projection et tri des sommets selon l'axe Z (Z-Ordering)
      const projected = points.map((p) => {
        // Rotation autour de Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotation autour de X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Projection perspective
        const scale = fov / (fov + z2 + 400);
        const x2d = x1 * scale + cx;
        const y2d = y2 * scale + cy;

        return { x: x2d, y: y2d, z: z2, scale, size: p.size };
      });

      // Rendu des connexions 3D (Lignes entre sommets voisins)
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25 * ((projected[i].scale + projected[j].scale) / 2);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Rendu des nœuds lumineux
      projected.forEach((p) => {
        const radius = Math.max(1, p.size * p.scale);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
        gradient.addColorStop(0, 'rgba(255, 230, 0, 0.9)');
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rendu des particules ambiantes en apesanteur
      ambientParticles.forEach((ap) => {
        ap.x += ap.speedX;
        ap.y += ap.speedY;

        if (ap.x < -width / 2) ap.x = width / 2;
        if (ap.x > width / 2) ap.x = -width / 2;
        if (ap.y < -height / 2) ap.y = height / 2;
        if (ap.y > height / 2) ap.y = -height / 2;

        const scale = fov / (fov + ap.z + 400);
        const px = ap.x * scale + cx;
        const py = ap.y * scale + cy;

        ctx.fillStyle = `rgba(59, 130, 246, ${0.35 * scale})`;
        ctx.beginPath();
        ctx.arc(px, py, ap.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default Background3D;
