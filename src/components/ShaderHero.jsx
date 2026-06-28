import { useEffect, useRef } from 'react';

const VERT_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float caustic(vec2 uv, float t) {
    float c = 0.0;
    float scale = 1.0;
    for (int i = 0; i < 5; i++) {
      vec2 p = uv * scale;
      p.x += sin(p.y * 1.8 + t * 0.4 + float(i) * 0.7) * 0.35;
      p.y += sin(p.x * 2.1 + t * 0.3 + float(i) * 1.1) * 0.35;
      c += noise(p) / scale;
      scale *= 1.9;
    }
    return c;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;

    // Subtle mouse warp
    vec2 mouse = u_mouse / u_resolution;
    float mouseDist = length(uv - mouse);
    vec2 warpedUv = uv + (uv - mouse) * 0.03 / (mouseDist + 0.4);

    float t = u_time * 0.25;

    float c1 = caustic(warpedUv * 2.8, t);
    float c2 = caustic(warpedUv * 2.8 + vec2(2.3, 7.8), t * 0.75);
    float cm = c1 * c2;
    cm = pow(cm, 1.8);

    // Deep ocean palette
    vec3 abyss    = vec3(0.008, 0.022, 0.042);   // near-black deep
    vec3 deep     = vec3(0.012, 0.065, 0.11);    // dark navy
    vec3 aqua     = vec3(0.133, 0.827, 0.933);   // #22D3EE
    vec3 emerald  = vec3(0.22, 1.0, 0.533);      // #39FF88

    vec3 col = mix(abyss, deep, 0.5 + 0.5 * uv.y);
    col = mix(col, aqua,    cm * 0.35);
    col = mix(col, emerald, cm * cm * 0.12);

    // Scan-line shimmer (optional depth feel)
    float shimmer = sin(uv.y * 180.0 + t * 3.0) * 0.012;
    col += shimmer * aqua * cm;

    // Vignette — darker at edges
    float vig = 1.0 - smoothstep(0.35, 0.95, length((uv - 0.5) * vec2(1.2, 1.1)));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return; // graceful fallback — CSS gradient will show instead

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime     = gl.getUniformLocation(prog, 'u_time');
    const uRes      = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse    = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouseMove);

    let startTime = performance.now();
    let raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = Math.min(window.innerHeight, 900); // cap at 900px
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    const render = (now) => {
      const t = (now - startTime) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        display: 'block',
        zIndex: 0,
      }}
    />
  );
}
