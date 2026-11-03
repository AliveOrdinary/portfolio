// Motion for the blueprint pages. Everything here is an enhancement: without
// JavaScript, or with "reduce motion" on, the drawings are fully drawn and
// exploded, the name is plain text, and nothing moves.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// ---------------------------------------------------------------- ruler
// A drafting scale on the right edge: the marker and number follow the read.
function ruler() {
  const el = document.querySelector<HTMLElement>('[data-ruler]');
  if (!el) return;
  const out = el.querySelector<HTMLElement>('[data-ruler-n]');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(window.scrollY / max) : 0;
    el.style.setProperty('--p', String(p));
    if (out) out.textContent = String(Math.round(p * 100)).padStart(3, '0');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ---------------------------------------------------------------- sticky nav
function nav() {
  const el = document.querySelector<HTMLElement>('.site-nav');
  if (!el) return;
  const update = () => el.classList.toggle('is-stuck', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

ruler();
nav();

// ---------------------------------------------------------------- name decode
// Each letter cycles through glyphs, then settles, left to right.
function decode(el: HTMLElement) {
  const final = el.textContent ?? '';
  const glyphs = '#%&@*+=/<>[]0123456789ABCDEFX';
  let frame = 0;
  const tick = () => {
    let done = true;
    el.textContent = [...final]
      .map((ch, i) => {
        if (ch === ' ' || frame >= 6 + i * 2) return ch;
        done = false;
        return glyphs[(Math.random() * glyphs.length) | 0];
      })
      .join('');
    frame++;
    if (!done) setTimeout(tick, 45);
  };
  tick();
}

// ---------------------------------------------------------------- reveals
function reveals() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

// ---------------------------------------------------------------- figures
type Part = { g: SVGGElement; dx: number; dy: number };
type Fig = {
  svg: SVGSVGElement;
  parts: Part[];
  fades: SVGGElement[];
  callouts: SVGGElement | null;
  plotStart: number | null; // when the explode-in clock started
  typed: boolean;
  visible: boolean;
};

const STROKED = 'polygon, line, polyline, path';

function typeText(t: SVGTextElement, delay: number) {
  const full = t.dataset.full ?? t.textContent ?? '';
  t.dataset.full = full;
  t.textContent = '';
  let i = 0;
  const step = () => {
    t.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(step, 24);
  };
  setTimeout(step, delay);
}

function plot(f: Fig) {
  const els = [...f.svg.querySelectorAll<SVGGeometryElement>(STROKED)].filter(
    (el) => !el.closest('[data-fade], .bp-callouts'),
  );
  els.forEach((el, i) => {
    el.setAttribute('pathLength', '1');
    el.style.setProperty('--d', `${Math.min(i * 9, 650)}ms`);
  });
  f.svg.classList.add('plot');
  f.plotStart = performance.now() + 700;
  setTimeout(() => {
    f.svg.classList.replace('plot', 'drawn');
    els.forEach((el) => el.removeAttribute('pathLength'));
  }, 1900);
}

function apply(f: Fig, p: number) {
  const k = 1 - ease(p);
  for (const { g, dx, dy } of f.parts) g.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
  const fade = String(clamp((p - 0.55) / 0.45));
  f.fades.forEach((g) => (g.style.opacity = fade));
  if (f.callouts) {
    const show = p > 0.96;
    f.callouts.style.opacity = show ? '1' : '0';
    if (show && !f.typed) {
      f.typed = true;
      f.callouts.querySelectorAll<SVGTextElement>('text').forEach((t, i) => typeText(t, i * 90));
    }
  }
}

function figures() {
  const figs: Fig[] = [...document.querySelectorAll<SVGSVGElement>('svg.bp')].map((svg) => ({
    svg,
    parts: [...svg.querySelectorAll<SVGGElement>('[data-ex]')].map((g) => {
      const [dx, dy] = (g.dataset.ex ?? '0,0').split(',').map(Number);
      return { g, dx, dy };
    }),
    fades: [...svg.querySelectorAll<SVGGElement>('[data-fade]')],
    callouts: svg.querySelector<SVGGElement>('.bp-callouts'),
    plotStart: null,
    typed: false,
    visible: false,
  }));
  if (!figs.length) return;
  figs.forEach((f) => apply(f, 0));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const f = figs.find((x) => x.svg === e.target);
        if (!f) continue;
        f.visible = e.isIntersecting;
        if (e.isIntersecting && f.plotStart === null) plot(f);
      }
      loop();
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  figs.forEach((f) => io.observe(f.svg));

  // p = the smaller of where the figure is on screen and how long since it was drawn,
  // so a drawing always assembles first, then pulls apart as you scroll on.
  let raf = 0;
  const frame = (now: number) => {
    raf = 0;
    const vh = window.innerHeight;
    let again = false;
    for (const f of figs) {
      if (!f.visible || f.plotStart === null) continue;
      const r = f.svg.getBoundingClientRect();
      const start = vh * 0.95;
      const end = vh * 0.45;
      const scrollP = clamp((start - r.top) / (start - end));
      const timeP = clamp((now - f.plotStart) / 1100);
      if (timeP < 1) again = true;
      apply(f, Math.min(scrollP, timeP));
    }
    if (again) loop();
  };
  const loop = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  window.addEventListener('scroll', loop, { passive: true });
  window.addEventListener('resize', loop);
}

if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-decode]').forEach(decode);
  reveals();
  figures();
}
