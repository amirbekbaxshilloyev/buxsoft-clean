"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ─── GLSL ─────────────────────────────────────────────────────────── */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/* Domain-warped Fractional Brownian Motion (Inigo Quilez technique).
   5 octave value noise → two warp passes → final scalar.
   Colors: deep navy (#020617) + slate blue + dark teal (ledger) + gold shadow.
   Everything stays very dark — the motion is the texture, not the hue. */
const FRAG = `
precision mediump float;
uniform vec2  u_r;
uniform float u_t;

float hsh(vec2 p){
  return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
}
float vn(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hsh(i),hsh(i+vec2(1,0)),f.x),
             mix(hsh(i+vec2(0,1)),hsh(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  mat2 m=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*vn(p);p=m*p*2.+vec2(31.7,81.3);a*=.5;}
  return v;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_r;
  uv.x*=u_r.x/u_r.y;
  float t=u_t*.011;

  /* two-layer domain warp */
  vec2 q=vec2(fbm(uv+t*vec2(.28,.20)),
              fbm(uv+vec2(5.2,1.3)+t*vec2(-.18,.26)));
  vec2 r=vec2(fbm(uv+2.6*q+vec2(1.7,9.2)+t*vec2(.32,-.22)),
              fbm(uv+2.6*q+vec2(8.3,2.8)+t*vec2(-.28,.34)));
  float f=fbm(uv+2.6*r);

  /* palette — extremely dark, finance-toned */
  vec3 c1=vec3(.008,.024,.090); /* #020617  deep navy   */
  vec3 c2=vec3(.032,.072,.142); /* #081224  navy blue   */
  vec3 c3=vec3(.053,.150,.272); /* #0d2645  slate       */
  vec3 c4=vec3(.044,.148,.096); /* #0b2619  teal ledger */
  vec3 c5=vec3(.090,.072,.008); /* #171200  gold shadow */

  vec3 col=c1;
  col=mix(col,c2,smoothstep(.00,.34,f));
  col=mix(col,c3,smoothstep(.30,.58,f)*.52);
  col=mix(col,c4,smoothstep(.50,.76,f)*.44);
  col=mix(col,c5,smoothstep(.68,.94,f)*.36);
  col=mix(col,c1,smoothstep(.90,1.0,f)*.55);

  /* radial vignette — edges darker, center alive */
  vec2 vu=gl_FragCoord.xy/u_r;
  float vig=pow(clamp(vu.x*vu.y*(1.-vu.x)*(1.-vu.y)*22.,0.,1.),.25);
  col*=mix(.42,1.,vig);

  gl_FragColor=vec4(col,1.);
}`;

/* ─── WebGL bootstrap ───────────────────────────────────────────────── */

function mkGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: false, antialias: false, powerPreference: "low-power",
  });
  if (!gl) return null;

  function sh(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return gl!.getShaderParameter(s, gl!.COMPILE_STATUS) ? s : null;
  }

  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  return {
    gl,
    uR: gl.getUniformLocation(prog, "u_r"),
    uT: gl.getUniformLocation(prog, "u_t"),
  };
}

/* ─── Component ─────────────────────────────────────────────────────── */

export function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const reduced   = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    /* skip WebGL on mobile — CSS orbs suffice */
    if (!canvas || window.innerWidth < 768) return;

    const ctx = mkGL(canvas);
    if (!ctx) return;   /* CSS fallback handles it */
    const { gl, uR, uT } = ctx;

    function resize() {
      /* render at 1/3 resolution — smooth noise needs no more */
      const w = Math.round(window.innerWidth  / 3);
      const h = Math.round(window.innerHeight / 3);
      canvas!.width  = w;
      canvas!.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uR, w, h);
    }
    resize();

    let tid: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(tid);
      tid = setTimeout(resize, 180);
    });
    ro.observe(document.documentElement);

    const t0 = performance.now();
    let last = 0;
    function frame(now: number) {
      rafRef.current = requestAnimationFrame(frame);
      if (now - last < 33) return;   /* ~30 fps cap */
      last = now;
      gl.uniform1f(uT, ((now - t0) * 0.001) % 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      clearTimeout(tid);
    };
  }, [reduced]);

  /* Always render the CSS base + orbs.
     WebGL canvas overlays on desktop; CSS gradient shows on mobile/fallback. */
  return (
    <>
      {/* CSS base gradient — always visible (WebGL fallback + mobile) */}
      <div className="bg-base" aria-hidden />

      {!reduced && (
        <>
          {/* WebGL noise canvas — desktop only, mounts on top of base */}
          <canvas ref={canvasRef} className="bg-gl" aria-hidden />

          {/* Accent orbs — gold (authority) + blue (trust) */}
          <div className="bg-orb bg-orb--g" aria-hidden />
          <div className="bg-orb bg-orb--b" aria-hidden />

          {/* Ledger grid + slow scan pulses */}
          <div className="bg-ledger" aria-hidden>
            <div className="bg-scan bg-scan--a" />
            <div className="bg-scan bg-scan--b" />
          </div>
        </>
      )}
    </>
  );
}
