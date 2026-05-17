import { useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 }); // Posición inicial fuera de pantalla

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf;
    const dpr = window.devicePixelRatio || 1;
    const starCount = window.innerWidth < 768 ? 150 : 450;
    
    // Parámetros del "Agujero Negro"
    const holeRadius = 100; // Área de influencia
    const distortionStrength = 0.4; // Qué tanto se curvan las estrellas

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.3,
      v: Math.random() * 0.0004 + 0.0001,
      o: Math.random(),
      do: Math.random() * 0.01 + 0.005,
    }));

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      stars.forEach((s) => {
        // 1. Movimiento base (caída vertical)
        s.y += s.v;
        if (s.y > 1) s.y = 0;
        
        // 2. Cálculo de la distorsión por el "Agujero Negro"
        const starX = s.x * w;
        const starY = s.y * h;
        const dx = mouse.current.x - starX;
        const dy = mouse.current.y - starY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let drawX = starX;
        let drawY = starY;

        // Si la estrella está cerca del mouse, se curva hacia él
        if (distance < holeRadius) {
          const force = (holeRadius - distance) / holeRadius;
          drawX += dx * force * distortionStrength;
          drawY += dy * force * distortionStrength;
        }

        // 3. Parpadeo
        s.o += s.do;
        if (s.o > 1 || s.o < 0.3) s.do *= -1;

        // 4. Dibujo con la posición distorsionada
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full bg-black"
      style={{ pointerEvents: "none" }}
    />
  );
}
