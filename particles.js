// ============================================================
// Particles — vanilla-JS port of reactbits' <Particles /> (ogl).
// The original is a React component (useRef/useEffect); this
// keeps the exact same OGL render logic, just wired up as a
// plain init function called once on load instead of mounted/
// unmounted by React. Loaded as a module so it can import ogl
// straight from a CDN without a bundler.
// ============================================================
import { Renderer, Camera, Geometry, Program, Mesh } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if (uAlphaParticles < 0.5) {
      if (d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(function (c) { return c + c; }).join('');
  }
  var int = parseInt(hex, 16);
  var r = ((int >> 16) & 255) / 255;
  var g = ((int >> 8) & 255) / 255;
  var b = (int & 255) / 255;
  return [r, g, b];
}

function initParticles(container, opts) {
  if (!container) return;

  var renderer = new Renderer({ dpr: opts.pixelRatio, depth: false, alpha: true });
  var gl = renderer.gl;
  container.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);

  var camera = new Camera(gl, { fov: 15 });
  camera.position.set(0, 0, opts.cameraDistance);

  function resize() {
    var width = container.clientWidth;
    var height = container.clientHeight;
    if (width < 50 || height < 50) return;
    renderer.setSize(width, height);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  }
  window.addEventListener('resize', resize, false);
  resize();
  // container can report a bogus transient size at module-init time
  // (before web fonts/layout settle), so re-measure once everything
  // has actually finished loading, plus a couple of rAF-delayed
  // rechecks to catch late reflows even when the load event has
  // already fired by the time this module runs.
  window.addEventListener('load', resize, false);
  requestAnimationFrame(function () {
    requestAnimationFrame(resize);
  });
  setTimeout(resize, 300);

  var mouse = { x: 0, y: 0 };
  function handleMouseMove(e) {
    var rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  if (opts.moveParticlesOnHover) {
    container.addEventListener('mousemove', handleMouseMove);
  }

  var count = opts.particleCount;
  var positions = new Float32Array(count * 3);
  var randoms = new Float32Array(count * 4);
  var colors = new Float32Array(count * 3);
  var palette = opts.particleColors && opts.particleColors.length > 0 ? opts.particleColors : ['#ffffff'];

  for (var i = 0; i < count; i++) {
    var x, y, z, len;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      len = x * x + y * y + z * z;
    } while (len > 1 || len === 0);
    var r = Math.cbrt(Math.random());
    positions.set([x * r, y * r, z * r], i * 3);
    randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    var col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
    colors.set(col, i * 3);
  }

  var geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    random: { size: 4, data: randoms },
    color: { size: 3, data: colors }
  });

  var program = new Program(gl, {
    vertex: vertex,
    fragment: fragment,
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: opts.particleSpread },
      uBaseSize: { value: opts.particleBaseSize * opts.pixelRatio },
      uSizeRandomness: { value: opts.sizeRandomness },
      uAlphaParticles: { value: opts.alphaParticles ? 1 : 0 }
    },
    transparent: true,
    depthTest: false
  });

  var particles = new Mesh(gl, { mode: gl.POINTS, geometry: geometry, program: program });

  var lastTime = performance.now();
  var elapsed = 0;

  function update(t) {
    requestAnimationFrame(update);
    var delta = t - lastTime;
    lastTime = t;
    elapsed += delta * opts.speed;

    program.uniforms.uTime.value = elapsed * 0.001;

    if (opts.moveParticlesOnHover) {
      particles.position.x = -mouse.x * opts.particleHoverFactor;
      particles.position.y = -mouse.y * opts.particleHoverFactor;
    } else {
      particles.position.x = 0;
      particles.position.y = 0;
    }

    if (!opts.disableRotation) {
      particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
      particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
      particles.rotation.z += 0.01 * opts.speed;
    }

    renderer.render({ scene: particles, camera: camera });
  }
  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('particles-canvas');
  if (!container) return;
  initParticles(container, {
    particleColors: ['#6C2BD9', '#8B5CF6', '#a78bfa'],
    particleCount: 500,
    particleSpread: 10,
    speed: 0.15,
    particleBaseSize: 90,
    moveParticlesOnHover: true,
    particleHoverFactor: 1,
    alphaParticles: true,
    sizeRandomness: 1,
    cameraDistance: 20,
    disableRotation: false,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
  });
});
