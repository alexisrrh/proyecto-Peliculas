import { useEffect, useRef } from "react";

export default function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf;
    const dpr = window.devicePixelRatio || 1;

    // Configuración: 150 estrellas en móvil, 450 en PC
    const starCount = window.innerWidth < 768 ? 150 : 450;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.3, // Estrellas finas
      v: Math.random() * 0.0004 + 0.0001, // Velocidad de caída lenta
      o: Math.random(), // Opacidad
      do: Math.random() * 0.01 + 0.005, // Velocidad de parpadeo
    }));

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Fondo negro profundo
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      stars.forEach((s) => {
        s.y += s.v;
        if (s.y > 1) s.y = 0;
        
        // Parpadeo suave
        s.o += s.do;
        if (s.o > 1 || s.o < 0.3) s.do *= -1;

        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
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
