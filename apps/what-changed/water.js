(() => {
  const canvas = document.querySelector("#water");
  const ctx = canvas.getContext("2d", { alpha: false });
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0, dpr = 1, start = performance.now();

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now(), true);
  }

  function draw(now, once = false) {
    const t = still ? 0 : (now - start) / 1000;
    const horizon = h * .42;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#020507"); sky.addColorStop(.48, "#07151b"); sky.addColorStop(1, "#06141a");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    const mx = w * .68, my = h * .17;
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(w, h) * .24);
    halo.addColorStop(0, "rgba(213,235,226,.12)"); halo.addColorStop(1, "rgba(213,235,226,0)");
    ctx.fillStyle = halo; ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(3,8,10,.96)"; ctx.beginPath(); ctx.moveTo(0, horizon + 10);
    for (let x = 0; x <= w; x += 38) ctx.lineTo(x, horizon + Math.sin(x * .014) * 8 + Math.sin(x * .041 + 1.8) * 4);
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();

    const water = ctx.createLinearGradient(0, horizon, 0, h);
    water.addColorStop(0, "rgba(8,36,47,.76)"); water.addColorStop(1, "rgba(2,11,15,.98)");
    ctx.fillStyle = water; ctx.fillRect(0, horizon, w, h - horizon);

    ctx.lineWidth = 1;
    for (let i = 0; i < 34; i++) {
      const y0 = horizon + 14 + i * ((h - horizon) / 32);
      ctx.strokeStyle = `rgba(185,230,212,${Math.max(.025, .16 - i * .0037)})`;
      ctx.beginPath();
      for (let x = -40; x <= w + 40; x += 18) {
        const y = y0 + Math.sin(x * (.016 + i * .0003) + t * (.46 + i * .012) + i) * (5 + i * .44);
        x === -40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    if (!still && !once) requestAnimationFrame(draw);
  }

  addEventListener("resize", resize, { passive: true });
  resize();
  if (!still) requestAnimationFrame(draw);
})();
