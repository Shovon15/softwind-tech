import * as THREE from "three";

/**
 * "Digital network globe": a sphere of connected nodes (a data network), an inner
 * rotating core, orbit rings with travelling data packets and a deep particle field.
 *
 * - Pointer: tilts the globe and lights up nodes/links under the cursor
 * - Scroll: globe travels between keyframed positions per section, spins, and
 *   "breathes" outward with scroll velocity
 *
 * Plain three.js (no React renderer) so the bundle stays small and the render loop
 * never goes through React.
 */

const PRIMARY = new THREE.Color("#e61f25");
const NODE = new THREE.Color("#a7d8d2");

const NODE_COUNT = 520;
const LINK_NEIGHBOURS = 3;
const RADIUS = 2.2;

// Where the globe sits as the page scrolls (p = page progress 0..1)
const KEYFRAMES = [
  { p: 0.0, x: 2.4, y: -0.1, s: 1.0 },
  { p: 0.12, x: -2.6, y: 0.0, s: 0.85 },
  { p: 0.3, x: 2.6, y: 0.2, s: 0.95 },
  { p: 0.5, x: 0.0, y: 0.0, s: 1.45 },
  { p: 0.7, x: -2.5, y: 0.0, s: 0.9 },
  { p: 0.88, x: 2.4, y: 0.1, s: 1.0 },
  { p: 1.0, x: 0.0, y: 0.4, s: 1.15 },
];

const pointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  uniform float uExpand;
  attribute float aRandom;
  varying float vGlow;
  varying float vAlpha;

  void main() {
    vec3 dir = normalize(position);
    float d = distance(position, uPointer);
    float hover = smoothstep(1.3, 0.0, d) * uPointerStrength;
    // A slow band of light sweeping over the globe, like data flowing
    float wave = pow(sin(dir.y * 5.0 - uTime * 1.2 + aRandom * 0.8) * 0.5 + 0.5, 10.0);

    vec3 p = position + dir * (hover * 0.28 + uExpand * aRandom * 0.7);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float facing = (normalMatrix * dir).z;
    vAlpha = 0.2 + 0.8 * smoothstep(-0.3, 0.6, facing);
    vGlow = max(hover, wave * 0.7);
    gl_PointSize = uSize * uPixelRatio * (0.7 + aRandom * 0.6 + hover * 1.8 + wave * 0.6) / -mv.z;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vGlow;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    vec3 c = mix(uColorA, uColorB, vGlow);
    gl_FragColor = vec4(c, a * vAlpha * (0.55 + vGlow) * uOpacity);
  }
`;

const lineVertex = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  uniform float uExpand;
  attribute float aRandom;
  varying float vGlow;
  varying float vAlpha;

  void main() {
    vec3 dir = normalize(position);
    float hover = smoothstep(1.4, 0.0, distance(position, uPointer)) * uPointerStrength;
    float wave = pow(sin(dir.y * 5.0 - uTime * 1.2 + aRandom * 0.8) * 0.5 + 0.5, 10.0);

    vec3 p = position + dir * (hover * 0.28 + uExpand * aRandom * 0.7);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    float facing = (normalMatrix * dir).z;
    vAlpha = 0.15 + 0.85 * smoothstep(-0.3, 0.6, facing);
    vGlow = max(hover, wave * 0.6);
  }
`;

const lineFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vGlow;
  varying float vAlpha;

  void main() {
    vec3 c = mix(uColorA, uColorB, vGlow);
    gl_FragColor = vec4(c, (0.07 + vGlow * 0.55) * vAlpha * uOpacity);
  }
`;

function fibonacciSphere(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r,
        y,
        Math.sin(theta) * r,
      ).multiplyScalar(radius * (0.97 + Math.random() * 0.06)),
    );
  }
  return pts;
}

function circleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function sampleKeyframes(p: number) {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      const e = t * t * (3 - 2 * t); // smoothstep
      return {
        x: a.x + (b.x - a.x) * e,
        y: a.y + (b.y - a.y) * e,
        s: a.s + (b.s - a.s) * e,
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
}

export function createTechScene(
  canvas: HTMLCanvasElement,
  opts: { reduceMotion: boolean },
) {
  const isSmall = window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: window.devicePixelRatio < 2,
    powerPreference: "high-performance",
  });
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Travels with scroll; tilt follows the pointer
  const rig = new THREE.Group();
  const globe = new THREE.Group();
  rig.add(globe);
  scene.add(rig);

  /* ---------- Network nodes ---------- */
  const nodes = fibonacciSphere(isSmall ? 320 : NODE_COUNT, RADIUS);
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  nodeGeo.setAttribute(
    "aRandom",
    new THREE.Float32BufferAttribute(
      nodes.map(() => Math.random()),
      1,
    ),
  );

  const sharedUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector3(99, 99, 99) },
    uPointerStrength: { value: 0 },
    uExpand: { value: 0 },
    uColorA: { value: NODE },
    uColorB: { value: PRIMARY },
    uOpacity: { value: 0 },
  };

  const nodeMat = new THREE.ShaderMaterial({
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    uniforms: {
      ...sharedUniforms,
      uSize: { value: 70 },
      uPixelRatio: { value: pixelRatio },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  globe.add(new THREE.Points(nodeGeo, nodeMat));

  /* ---------- Links: each node to its nearest neighbours ---------- */
  const linkPositions: number[] = [];
  const linkRandom: number[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const nearest = nodes
      .map((n, j) => ({
        j,
        d: i === j ? Infinity : nodes[i].distanceToSquared(n),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, LINK_NEIGHBOURS);
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = Math.random();
      linkPositions.push(
        nodes[i].x,
        nodes[i].y,
        nodes[i].z,
        nodes[j].x,
        nodes[j].y,
        nodes[j].z,
      );
      linkRandom.push(r, r);
    }
  }
  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linkPositions, 3),
  );
  linkGeo.setAttribute(
    "aRandom",
    new THREE.Float32BufferAttribute(linkRandom, 1),
  );
  const linkMat = new THREE.ShaderMaterial({
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    uniforms: sharedUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  globe.add(new THREE.LineSegments(linkGeo, linkMat));

  /* ---------- Inner core ---------- */
  const coreGeo = new THREE.EdgesGeometry(
    new THREE.IcosahedronGeometry(0.75, 1),
  );
  const coreMat = new THREE.LineBasicMaterial({
    color: PRIMARY,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const core = new THREE.LineSegments(coreGeo, coreMat);
  rig.add(core);

  /* ---------- Orbit rings + data packets ---------- */
  const dotTexture = circleTexture();
  const orbits: {
    line: THREE.LineLoop;
    curve: THREE.EllipseCurve;
    speed: number;
    offset: number;
  }[] = [];
  const ringMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  [
    { r: 3.0, tilt: [1.2, 0.2, 0], speed: 0.12 },
    { r: 3.4, tilt: [0.4, 0.9, 0.3], speed: -0.08 },
    { r: 2.75, tilt: [-0.6, -0.4, 0.8], speed: 0.16 },
  ].forEach(({ r, tilt, speed }) => {
    const curve = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2, false, 0);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(160));
    const line = new THREE.LineLoop(geo, ringMat);
    line.rotation.set(tilt[0], tilt[1], tilt[2]);
    rig.add(line);
    orbits.push({ line, curve, speed, offset: Math.random() });
  });

  const PACKETS_PER_ORBIT = 2;
  const packetGeo = new THREE.BufferGeometry();
  packetGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      new Float32Array(orbits.length * PACKETS_PER_ORBIT * 3),
      3,
    ),
  );
  const packetMat = new THREE.PointsMaterial({
    color: PRIMARY,
    size: 0.13,
    map: dotTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const packets = new THREE.Points(packetGeo, packetMat);
  rig.add(packets);

  /* ---------- Deep particle field ---------- */
  const FIELD = isSmall ? 500 : 1100;
  const fieldPos = new Float32Array(FIELD * 3);
  for (let i = 0; i < FIELD; i++) {
    fieldPos[i * 3] = (Math.random() - 0.5) * 30;
    fieldPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
    fieldPos[i * 3 + 2] = -Math.random() * 18 - 2;
  }
  const fieldGeo = new THREE.BufferGeometry();
  fieldGeo.setAttribute("position", new THREE.BufferAttribute(fieldPos, 3));
  const fieldMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    map: dotTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const field = new THREE.Points(fieldGeo, fieldMat);
  scene.add(field);

  /* ---------- Input ---------- */
  const pointer = new THREE.Vector2(0, 0);
  const pointerSmooth = new THREE.Vector2(0, 0);
  let pointerActive = false;
  const raycaster = new THREE.Raycaster();
  const hitSphere = new THREE.Sphere(new THREE.Vector3(), RADIUS);
  const hitPoint = new THREE.Vector3();

  const onPointerMove = (e: PointerEvent) => {
    pointer.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
    pointerActive = true;
  };
  const onPointerLeave = () => {
    pointerActive = false;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  /* ---------- Loop ---------- */
  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  let lastScroll = window.scrollY;
  let velocity = 0;
  let spin = 0;
  let fadeIn = 0;
  const smooth = {
    x: KEYFRAMES[0].x,
    y: KEYFRAMES[0].y,
    s: KEYFRAMES[0].s,
    p: 0,
  };
  const packetPos = packetGeo.getAttribute("position") as THREE.BufferAttribute;
  const tmp = new THREE.Vector3();

  const render = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const motion = opts.reduceMotion ? 0 : 1;

    // Scroll state
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const progress = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    const delta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    velocity = THREE.MathUtils.lerp(
      velocity,
      Math.min(Math.abs(delta) / 40, 1),
      0.08,
    );

    const target = sampleKeyframes(progress);
    const ease = 1 - Math.pow(0.04, dt); // frame-rate independent smoothing
    const mobileScale = isSmall ? 0.35 : 1;
    smooth.x += (target.x * mobileScale - smooth.x) * ease;
    smooth.y += (target.y - smooth.y) * ease;
    smooth.s += (target.s * (isSmall ? 0.75 : 1) - smooth.s) * ease;
    smooth.p += (progress - smooth.p) * ease;

    rig.position.set(smooth.x, smooth.y, 0);
    rig.scale.setScalar(smooth.s);

    // Pointer tilt + idle/scroll spin
    pointerSmooth.lerp(pointer, 0.06);
    rig.rotation.x = pointerSmooth.y * -0.35;
    rig.rotation.y = pointerSmooth.x * 0.5;
    spin += dt * (0.06 + velocity * 0.6) * motion;
    globe.rotation.y = spin + smooth.p * Math.PI * 2;
    globe.rotation.x = Math.sin(t * 0.15) * 0.15 * motion;
    core.rotation.set(-spin * 1.6, spin * 2.2, 0);

    // Pointer hit on the globe (in globe-local space)
    raycaster.setFromCamera(pointerSmooth, camera);
    hitSphere.center.setFromMatrixPosition(globe.matrixWorld);
    hitSphere.radius = RADIUS * smooth.s;
    const hit =
      pointerActive && raycaster.ray.intersectSphere(hitSphere, hitPoint);
    if (hit)
      sharedUniforms.uPointer.value.copy(globe.worldToLocal(hitPoint.clone()));
    sharedUniforms.uPointerStrength.value = THREE.MathUtils.lerp(
      sharedUniforms.uPointerStrength.value,
      hit ? 1 : 0,
      0.08,
    );

    sharedUniforms.uTime.value = t * motion;
    sharedUniforms.uExpand.value = velocity * 0.6 * motion;

    // Gentle fade in on first frames
    fadeIn = Math.min(1, fadeIn + dt * 0.6);
    const o = fadeIn * fadeIn * (3 - 2 * fadeIn);
    sharedUniforms.uOpacity.value = o;
    coreMat.opacity = 0.45 * o;
    ringMat.opacity = 0.1 * o;
    packetMat.opacity = 0.95 * o;
    fieldMat.opacity = 0.45 * o;

    // Data packets travelling along orbits
    orbits.forEach((orbit, i) => {
      for (let k = 0; k < PACKETS_PER_ORBIT; k++) {
        const u =
          (((t * orbit.speed + orbit.offset + k / PACKETS_PER_ORBIT) % 1) + 1) %
          1;
        const pt = orbit.curve.getPoint(u);
        tmp.set(pt.x, pt.y, 0).applyEuler(orbit.line.rotation);
        packetPos.setXYZ(i * PACKETS_PER_ORBIT + k, tmp.x, tmp.y, tmp.z);
      }
    });
    packetPos.needsUpdate = true;

    // Particle field: depth parallax with scroll + pointer
    field.position.y = smooth.p * 14;
    field.position.x = pointerSmooth.x * -0.4;
    field.rotation.z = t * 0.01 * motion;

    renderer.render(scene, camera);
  };

  const loop = () => {
    render();
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Pause when the tab is hidden
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  start();

  return {
    start,
    stop,
    dispose() {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      [
        nodeGeo,
        linkGeo,
        coreGeo,
        packetGeo,
        fieldGeo,
        ...orbits.map((o) => o.line.geometry),
      ].forEach((g) => g.dispose());
      [nodeMat, linkMat, coreMat, ringMat, packetMat, fieldMat].forEach((m) =>
        m.dispose(),
      );
      dotTexture.dispose();
      renderer.dispose();
    },
  };
}

export type TechScene = ReturnType<typeof createTechScene>;
