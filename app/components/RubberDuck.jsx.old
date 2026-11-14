"use client"

// This duck character was fully generated for me by Claude (LLM agent) using Randis UDS (see Attribution below).
// I have no idea how to make a 3D duck of this calibre, or what any of this code is doing
// It seems to be nesting C++ code in order to make the stuff happen.
//
// That being said, if this duck spontaneously opens a portal to Hell, I am not responsible.
// I cannot be held liable for any harm that comes to you or your bloodline.
// But I think he's harmless.

// Attribution:
// RubberDuck.jsx - no files or libraries needed. Usage: <RubberDuck height={175} maxWidth={320} />
// Optional: pass quackRef={useRef()} then call quackRef.current() to make him quack.
// Next.js: add "use client" as the first line. All browser code runs inside useEffect.
// Needs WebGL; the canvas hides itself if it isn't available.
// Keep the Randis UDS attribution in your project notices.
import React, { useEffect, useRef } from "react";

const VERT = "attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }";
const DUCK_FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uU; uniform mat3 uR; uniform mat3 uRi; uniform vec3 uT; uniform float uSh;
uniform vec3 uBU; uniform vec3 uBL; uniform float uBeak;
const float F = 7.0;

float sdE(vec3 p, vec3 r){ float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 0.00001); }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
vec3 rotz(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.y, -s * p.x + c * p.y, p.z); }
vec2 opU(vec2 a, vec2 b){ return a.x < b.x ? a : b; }

// material ids: 0 yellow, 1 beak orange, 2 eye white, 3 pupil, 6 wing yellow, 7 sparkle, 8 mouth
vec2 map(vec3 p){
  vec3 q = vec3(p.x, p.y, abs(p.z));
  float body = sdE(p - vec3(0.0, -0.5, 0.0), vec3(1.05, 0.72, 0.8));
  float head = sdE(p - vec3(0.58, 0.5, 0.0), vec3(0.56, 0.56, 0.54));
  float tail = sdE(rotz(p - vec3(-1.05, -0.05, 0.0), -0.6), vec3(0.4, 0.2, 0.2));
  float d = smin(smin(body, head, 0.07), tail, 0.06);
  float wing = sdE(rotz(q - vec3(-0.15, -0.4, 0.72), -0.15), vec3(0.5, 0.3, 0.14));
  vec2 res = vec2(smin(d, wing, 0.06), wing < d ? 6.0 : 0.0);
  float beakU = sdE(rotz(p - vec3(uBU.xy, 0.0), uBU.z), vec3(0.3, 0.095, 0.26));
  float beakL = sdE(rotz(p - vec3(uBL.xy, 0.0), uBL.z), vec3(0.25, 0.065, 0.21));
  res = opU(res, vec2(smin(beakU, beakL, 0.03), 1.0));
  if (uBeak > 0.02) res = opU(res, vec2(sdE(p - vec3(1.0, 0.33, 0.0), vec3(0.19, 0.02 + 0.075 * uBeak, 0.17)), 8.0));
  vec3 ec = vec3(0.84, 0.58, 0.41);
  vec3 en = normalize(vec3(0.78, 0.12, 0.61));
  vec3 pc = ec + en * 0.035;
  res = opU(res, vec2(length(q - ec) - 0.125, 2.0));
  res = opU(res, vec2(length(q - pc) - 0.098, 3.0));
  res = opU(res, vec2(length(q - (pc + normalize(en * 0.5 + vec3(0.15, 0.85, 0.1)) * 0.09)) - 0.034, 7.0));
  res = opU(res, vec2(length(q - (pc + normalize(en * 0.7 + vec3(-0.1, -0.5, 0.0)) * 0.088)) - 0.016, 7.0));
  return res;
}
vec3 calcN(vec3 p){
  vec2 e = vec2(1.0, -1.0) * 0.0012;
  return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}
float softsh(vec3 ro, vec3 rd){
  float res = 1.0, t = 0.03;
  for (int i = 0; i < 24; i++) {
    float h = map(ro + rd * t).x;
    res = min(res, 8.0 * h / t);
    t += clamp(h, 0.02, 0.2);
    if (res < 0.001 || t > 3.0) break;
  }
  return clamp(res, 0.0, 1.0);
}
float calcAO(vec3 p, vec3 n){
  float o = 0.0, s = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.09 * float(i);
    o += (h - map(p + n * h).x) * s; s *= 0.65;
  }
  return clamp(1.0 - 2.4 * o, 0.0, 1.0);
}
vec3 albedo(vec3 p, float m){
  if (m > 7.5) return vec3(0.32, 0.04, 0.07);
  if (m < 0.5) {
    vec3 c = vec3(1.0, 0.83, 0.22);
    vec3 q = vec3(p.x, p.y, abs(p.z));
    float b = smoothstep(0.17, 0.02, length((q - vec3(0.8, 0.3, 0.45)) * vec3(1.0, 1.2, 0.8)));
    return mix(c, vec3(1.0, 0.6, 0.52), b * 0.7);
  }
  if (m < 1.5) return vec3(1.0, 0.5, 0.06);
  if (m < 2.5) return vec3(0.97, 0.97, 0.99);
  if (m < 3.5) return vec3(0.03);
  return vec3(0.95, 0.72, 0.1);
}
vec3 shadeAt(vec3 p, float m, vec3 rdw){
  if (m > 6.5 && m < 7.5) return vec3(1.0);
  vec3 nm = calcN(p), n = uR * nm;
  vec3 lw = normalize(vec3(-0.45, 0.7, 0.6)), lm = uRi * lw;
  float shd = softsh(p + nm * 0.012, lm);
  float ao = calcAO(p, nm);
  float dif = max(dot(n, lw), 0.0);
  float fill = max(dot(n, normalize(vec3(0.6, -0.25, 0.5))), 0.0);
  float shine = 40.0, sa = 0.5;
  if (m > 0.5 && m < 1.5) { shine = 30.0; sa = 0.5; }
  else if (m > 1.5 && m < 2.5) { shine = 70.0; sa = 0.9; }
  else if (m > 2.5 && m < 3.5) { shine = 100.0; sa = 1.2; }
  vec3 alb = albedo(p, m);
  vec3 hv = normalize(lw - rdw);
  float spec = pow(max(dot(n, hv), 0.0), shine) * sa;
  float fr = pow(1.0 - max(dot(n, -rdw), 0.0), 3.0);
  vec3 amb = mix(vec3(0.20, 0.17, 0.22), vec3(0.50, 0.55, 0.72), n.y * 0.5 + 0.5);
  vec3 rf = reflect(rdw, n);
  vec3 env = mix(vec3(0.12, 0.14, 0.24), vec3(0.85, 0.9, 1.0), smoothstep(-0.2, 0.9, rf.y));
  vec3 col = alb * (amb * ao + vec3(1.0, 0.96, 0.88) * dif * shd * 0.95 + vec3(0.45, 0.55, 1.0) * fill * 0.22 * ao);
  col += vec3(1.0, 0.98, 0.92) * spec * shd;
  col += env * fr * 0.28 * ao + vec3(0.35, 0.45, 0.9) * fr * 0.18;
  return clamp(col, 0.0, 1.0);
}
void main(){
  vec2 c = gl_FragCoord.xy - 0.5 * uRes;
  float f = uU * F;
  vec3 rdw = normalize(vec3(c / f, -1.0));
  vec3 row = vec3(0.0, 0.0, F);
  vec3 ro = uRi * (row - uT), rd = uRi * rdw;
  float px = 1.0 / f;
  float sa = 0.0;
  if (rdw.y < -0.001) {
    float tt = (-1.3 - row.y) / rdw.y;
    vec3 q = row + rdw * tt;
    vec2 w = vec2(q.x / 1.35, q.z / 1.1);
    sa = exp(-dot(w, w) * 1.6) * 0.55 * uSh;
  }
  vec3 rgb = vec3(0.0);
  float alpha = 0.0;
  float b = dot(ro, rd), cc = dot(ro, ro) - 5.3;
  float hh = b * b - cc;
  if (hh > 0.0) {
    float sq = sqrt(hh), t = max(-b - sq, 0.0), tmax = -b + sq;
    float best = 1e9, tb = t, mb = 0.0;
    bool hit = false;
    for (int i = 0; i < 90; i++) {
      vec2 h = map(ro + rd * t);
      float ratio = h.x / t;
      if (ratio < best) { best = ratio; tb = t; mb = h.y; }
      if (h.x < 0.0012) { hit = true; tb = t; mb = h.y; break; }
      t += h.x * 0.85;
      if (t > tmax) break;
    }
    alpha = hit ? 1.0 : clamp(1.0 - best / px, 0.0, 1.0);
    if (alpha > 0.0) rgb = shadeAt(ro + rd * tb, mb, rdw) * alpha;
  }
  gl_FragColor = vec4(rgb, alpha + sa * (1.0 - alpha));
}`;

export default function RubberDuck({ height = 175, maxWidth = 320, quackRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const dcv = ref.current;
    const gl = dcv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    const mkS = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    let u = null;
    if (gl) {
      const v = mkS(gl.VERTEX_SHADER, VERT), f = mkS(gl.FRAGMENT_SHADER, DUCK_FRAG);
      if (v && f) {
        const prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f);
        gl.bindAttribLocation(prog, 0, "aPos"); gl.linkProgram(prog);
        if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
          gl.useProgram(prog); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
          u = {}; ["uRes", "uU", "uR", "uRi", "uT", "uSh", "uBU", "uBL", "uBeak"].forEach(n => { u[n] = gl.getUniformLocation(prog, n); });
        }
      }
    }
    if (!u) { dcv.style.display = "none"; return; } // no WebGL: render nothing

    const rotYX = (yaw, pitch) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      return [cy, 0, sy, sp * sy, cp, -sp * cy, -cp * sy, sp, cp * cy];
    };
    const transp = R => new Float32Array([R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]]);
    let yaw = -.45, pitch = .12, vyaw = 0, vpitch = 0, dragging = false, qscale = 1;
    let swayAmt = 1, sway = 0, lastRT = 0, alive = true;
    const quackWindows = []; // [start, end] ms of each quack's beak movement

    function render(t) {
      const r = dcv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.25) * qscale;
      const rw = Math.max(1, r.width * dpr), rh = Math.max(1, r.height * dpr);
      const k = Math.min(1, 560 / Math.max(rw, rh)); // ONE shared scale: keeps the aspect ratio (no stretching)
      const w = Math.max(2, Math.round(rw * k)), h = Math.max(2, Math.round(rh * k));
      if (dcv.width !== w || dcv.height !== h) { dcv.width = w; dcv.height = h; }
      gl.viewport(0, 0, w, h);
      const dtm = lastRT ? Math.min(100, Math.max(0, t - lastRT)) : 0; lastRT = t;
      const still = !dragging && Math.abs(vyaw) < 5e-4 && Math.abs(vpitch) < 5e-4;
      swayAmt = dragging ? 0 : swayAmt + ((still ? 1 : 0) - swayAmt) * (1 - Math.exp(-dtm / 700));
      sway = swayAmt * Math.sin(t / 1900) * .1; // idle sway fades in/out
      const R = rotYX(yaw + sway, pitch), T = [0, Math.sin(t / 900) * .06, 0];
      gl.uniform2f(u.uRes, w, h); gl.uniform1f(u.uU, Math.min(w, h) / 3.4);
      gl.uniformMatrix3fv(u.uR, false, transp(R)); gl.uniformMatrix3fv(u.uRi, false, new Float32Array(R));
      gl.uniform3f(u.uT, T[0], T[1], T[2]); gl.uniform1f(u.uSh, 1 - T[1] * 2);
      const nowMs = performance.now(); let b = 0;
      for (const q of quackWindows) if (nowMs >= q[0] && nowMs <= q[1]) b = Math.max(b, Math.sin(Math.PI * (nowMs - q[0]) / (q[1] - q[0])));
      const aU = .16 * b, aL = -.55 * b, hx = .95, hy = .34;
      const hinged = (cx0, cy0, a) => { const dx = cx0 - hx, dy = cy0 - hy; return [hx + dx * Math.cos(a) - dy * Math.sin(a), hy + dx * Math.sin(a) + dy * Math.cos(a), a]; };
      const bu = hinged(1.2, .4, aU), bl = hinged(1.15, .29, aL);
      gl.uniform3f(u.uBU, bu[0], bu[1], bu[2]); gl.uniform3f(u.uBL, bl[0], bl[1], bl[2]); gl.uniform1f(u.uBeak, b);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // drag to turn him; a click (no drag) makes him quack
    let px = 0, py = 0, moved = 0, lastMove = 0;
    const onDown = e => {
      yaw += sway; sway = 0; swayAmt = 0; // keep the angle he's showing right now
      dragging = true; moved = 0; px = e.clientX; py = e.clientY; vyaw = vpitch = 0; lastMove = performance.now();
      try { dcv.setPointerCapture(e.pointerId); } catch (_) {}
      dcv.style.cursor = "grabbing"; setAwake(true);
    };
    const onMove = e => {
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * .012; pitch += dy * .012; vyaw = dx * .012; vpitch = dy * .012; lastMove = performance.now();
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false; dcv.style.cursor = "grab";
      if (performance.now() - lastMove > 90) vyaw = vpitch = 0;
      if (moved < 5) { vyaw = vpitch = 0; quack(); }
    };
    dcv.addEventListener("pointerdown", onDown);
    dcv.addEventListener("pointermove", onMove);
    dcv.addEventListener("pointerup", endDrag);
    dcv.addEventListener("pointercancel", endDrag);

    // Only animate while someone can enjoy him: rests on blur / pointer leave / hidden tab
    let awake = true, looping = false, lastDuck = 0, gapAvg = 33, raf = 0;
    function setAwake(v) { awake = v; if (v && !looping && alive) { looping = true; raf = requestAnimationFrame(tick); } }
    function tick(t) {
      if (!alive) return;
      while (quackWindows.length && quackWindows[0][1] < performance.now() - 50) quackWindows.shift();
      const busy = dragging || Math.abs(vyaw) > 5e-4 || Math.abs(vpitch) > 5e-4 || quackWindows.length > 0;
      if ((!awake || document.hidden) && !busy) { render(t); looping = false; return; }
      raf = requestAnimationFrame(tick);
      const gap = t - lastDuck;
      if (!busy && gap < 40) return;
      if (gap < 400) { gapAvg = gapAvg * .9 + gap * .1; if (gapAvg > (busy ? 40 : 75) && qscale > .55) { qscale *= .85; gapAvg = busy ? 16 : 33; } } // auto-lower quality if slow
      lastDuck = t;
      if (!dragging) { yaw += vyaw; pitch += vpitch; vyaw *= .94; vpitch *= .94; }
      render(t);
    }
    const sleep = () => setAwake(false), wake = () => setAwake(true);
    const leave = () => { if (!dragging) setAwake(false); };
    const mm = () => { if (!awake) setAwake(true); };
    addEventListener("blur", sleep); addEventListener("focus", wake);
    document.addEventListener("mouseleave", leave); document.addEventListener("mouseenter", wake);
    addEventListener("mousemove", mm); document.addEventListener("focusout", wake); addEventListener("resize", wake);
    looping = true; raf = requestAnimationFrame(tick);

    // ---------- quack: one shared audio context, created on the first quack ----------
    let actx = null, master = null, verb = null, noise = null;
    function bus() {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const a = actx;
      if (!master) {
        master = a.createGain(); master.gain.value = .9;
        const comp = a.createDynamicsCompressor();
        comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 5; comp.attack.value = .004; comp.release.value = .25;
        master.connect(comp); comp.connect(a.destination);
        verb = a.createConvolver();
        const len = Math.floor(a.sampleRate * 2.8), ir = a.createBuffer(2, len, a.sampleRate);
        for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
        verb.buffer = ir;
        const vg = a.createGain(); vg.gain.value = .5; verb.connect(vg); vg.connect(master);
        noise = a.createBuffer(1, a.sampleRate * 3, a.sampleRate);
        const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      }
      return a;
    }
    const noiseSrc = a => { const s = a.createBufferSource(); s.buffer = noise; s.loop = true; return s; };
    const env = (g, t, peak, att, dur) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur); };
    const mixOut = (a, node, pan, wet) => {
      let n = node;
      if (a.createStereoPanner) { const p = a.createStereoPanner(); p.pan.value = pan || 0; n.connect(p); n = p; }
      n.connect(master);
      if (wet) { const w = a.createGain(); w.gain.value = wet; n.connect(w); w.connect(verb); }
    };
    const tone = (a, type, f0, f1, t, dur) => {
      const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); return o;
    };
    // Buzzy voice through two nasal resonances; sometimes a double "quack-quack". Opens the beak.
    function quack() {
      const a = bus(), count = Math.random() < .35 ? 2 : 1, pitchK = .92 + Math.random() * .16, now = performance.now();
      setAwake(true);
      for (let k = 0; k < count; k++) {
        const t = a.currentTime + .01 + k * .2, dur = .17, f0 = 640 * pitchK * (k ? .93 : 1), f1 = 250 * pitchK;
        quackWindows.push([now + 10 + k * 200, now + 10 + k * 200 + 180]);
        const o1 = tone(a, "sawtooth", f0, f1, t, dur), o2 = tone(a, "square", f0, f1, t, dur);
        o2.detune.value = 9;
        const lfo = a.createOscillator(), lg = a.createGain();
        lfo.frequency.value = 42; lg.gain.value = 14; lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
        const mix = a.createGain(), o2g = a.createGain(); mix.gain.value = .5; o2g.gain.value = .25;
        o1.connect(mix); o2.connect(o2g); o2g.connect(mix);
        const sum = a.createGain();
        [[1050, 700, 5, 1.4], [2300, 1700, 7, .8]].forEach(([fa, fb, q, lv]) => {
          const bp = a.createBiquadFilter(), lg2 = a.createGain();
          bp.type = "bandpass"; bp.Q.value = q; bp.frequency.setValueAtTime(fa, t); bp.frequency.exponentialRampToValueAtTime(fb, t + dur);
          lg2.gain.value = lv; mix.connect(bp); bp.connect(lg2); lg2.connect(sum);
        });
        const ns = noiseSrc(a), nf = a.createBiquadFilter(), ng = a.createGain();
        nf.type = "bandpass"; nf.frequency.value = 1800; nf.Q.value = 1.2; ng.gain.value = .25; ns.connect(nf); nf.connect(ng); ng.connect(sum);
        const g = a.createGain(); env(g, t, .55, .012, dur + .03); sum.connect(g); mixOut(a, g, 0, .18);
        [o1, o2, lfo].forEach(o => { o.start(t); o.stop(t + dur + .06); });
        ns.start(t, Math.random() * 2); ns.stop(t + dur + .06);
      }
    }
    if (quackRef) quackRef.current = () => { try { quack(); } catch (_) {} };

    return () => { // cleanup on unmount
      alive = false; cancelAnimationFrame(raf);
      removeEventListener("blur", sleep); removeEventListener("focus", wake);
      document.removeEventListener("mouseleave", leave); document.removeEventListener("mouseenter", wake);
      removeEventListener("mousemove", mm); document.removeEventListener("focusout", wake); removeEventListener("resize", wake);
      if (actx) actx.close();
    };
  }, [quackRef]);

  return (
    <canvas
      ref={ref}
      aria-label="Rubber duck (drag to turn him, click to quack)"
      style={{
        display: "block", width: "100%", maxWidth, height, margin: "0 auto", cursor: "grab", touchAction: "none",
        background: "radial-gradient(ellipse at 50% 35%,#222a47 0%,#000E1F 75%)",
      }}
    />
  );
}
