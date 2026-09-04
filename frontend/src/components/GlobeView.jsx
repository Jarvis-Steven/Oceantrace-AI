import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Globe as GlobeIcon, Map as MapIcon, RotateCw, AlertTriangle } from "lucide-react";

function latLonToVector3(lat, lon, radius = 10, altitude = 0.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + altitude;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function createWorldCanvasTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0c1e36";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const toX = (lon) => ((lon + 180) / 360) * canvas.width;
  const toY = (lat) => ((90 - lat) / 180) * canvas.height;

  const continents = [

    [[68, 24], [73, 22], [77, 8.5], [80, 13], [88, 22], [72, 35], [68, 24]],

    [[79.5, 9.8], [81.8, 8.5], [81.5, 6.2], [79.8, 6.2], [79.5, 9.8]],

    [[35, 30], [50, 30], [56, 26], [59, 22.5], [54, 16], [43, 12.5], [35, 30]],

    [[-18, 35], [33, 30], [51, 11.5], [40, -10], [20, -35], [15, -35], [9, 5], [-18, 35]],

    [[-10, 36], [10, 55], [40, 70], [140, 70], [120, 20], [100, 10], [60, 40], [30, 40], [-10, 36]],

    [[95, 22], [105, 12], [104, 1.5], [98, 8], [95, 22]],

    [[95, 5], [108, -6], [116, -8], [120, 2], [105, 6], [95, 5]],

    [[113, -12], [142, -11], [153, -28], [138, -35], [115, -35], [113, -12]],

    [[-130, 55], [-60, 55], [-80, 8], [-40, -10], [-70, -55], [-80, -5], [-100, 20], [-125, 32], [-130, 55]],

    [[43, -12], [50, -15], [47, -25], [43, -25], [43, -12]],
  ];

  ctx.fillStyle = "#1e3a5f";
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 4;

  continents.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lon, lat], i) => {
      const x = toX(lon);
      const y = toY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    ctx.beginPath();
    ctx.moveTo(toX(lon), 0);
    ctx.lineTo(toX(lon), canvas.height);
    ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    ctx.beginPath();
    ctx.moveTo(0, toY(lat));
    ctx.lineTo(canvas.width, toY(lat));
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, toY(0));
  ctx.lineTo(canvas.width, toY(0));
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export default function GlobeView({
  attribution,
  candidateVessels = [],
  selectedVessel,
  onSelectVessel,
  backwardDrift,
  forwardDrift,
  onSwitchTo2D,
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeGroupRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(false);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const webglSupported = useMemo(() => {
    try {
      const testCanvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!webglSupported || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070a12");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = Math.PI / 1.4;
    globeGroup.rotation.x = Math.PI / 7;
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const textureLoader = new THREE.TextureLoader();
    const globeTexture = textureLoader.load("/assets/earth-dark.jpg");
    globeTexture.colorSpace = THREE.SRGBColorSpace;

    const sphereGeometry = new THREE.SphereGeometry(10, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: globeTexture,
      shininess: 20,
      specular: new THREE.Color("#334155"),
      color: new THREE.Color("#ffffff"),
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(globeMesh);

    const continentalPolygons = [

      [[68, 24], [73, 22], [77, 8.5], [80, 13], [88, 22], [72, 35], [68, 24]],

      [[79.5, 9.8], [81.8, 8.5], [81.5, 6.2], [79.8, 6.2], [79.5, 9.8]],

      [[35, 30], [50, 30], [56, 26], [59, 22.5], [54, 16], [43, 12.5], [35, 30]],

      [[-18, 35], [33, 30], [51, 11.5], [40, -10], [20, -35], [15, -35], [9, 5], [-18, 35]],

      [[-10, 36], [10, 55], [40, 70], [140, 70], [120, 20], [100, 10], [60, 40], [30, 40], [-10, 36]],

      [[95, 22], [105, 12], [104, 1.5], [98, 8], [95, 22]],

      [[95, 5], [108, -6], [116, -8], [120, 2], [105, 6], [95, 5]],

      [[113, -12], [142, -11], [153, -28], [138, -35], [115, -35], [113, -12]],

      [[-130, 55], [-60, 55], [-80, 8], [-40, -10], [-70, -55], [-80, -5], [-100, 20], [-125, 32], [-130, 55]],
    ];

    const coastlineMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
    continentalPolygons.forEach((poly) => {
      const points = poly.map(([lon, lat]) => latLonToVector3(lat, lon, 10.06));
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geom, coastlineMat);
      globeGroup.add(line);
    });

    const atmosphereGeometry = new THREE.SphereGeometry(10.35, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#06b6d4"),
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(20, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.8);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    if (backwardDrift?.trajectory && backwardDrift.trajectory.length > 1) {
      const points = backwardDrift.trajectory.map((p) => latLonToVector3(p.lat, p.lon, 10, 0.08));
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      globeGroup.add(tubeMesh);
    }

    if (forwardDrift?.trajectory && forwardDrift.trajectory.length > 1) {
      const points = forwardDrift.trajectory.map((p) => latLonToVector3(p.lat, p.lon, 10, 0.08));
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      globeGroup.add(tubeMesh);
    }

    candidateVessels.forEach((v) => {
      if (typeof v.lat !== "number" || typeof v.lon !== "number") return;
      const pos = latLonToVector3(v.lat, v.lon, 10, 0.12);

      const isTop = v.rank === 1;
      const pinColor = isTop ? 0xef4444 : v.rank <= 5 ? 0xeab308 : 0x06b6d4;

      const pinGeom = new THREE.SphereGeometry(isTop ? 0.22 : 0.15, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { vessel: v };
      globeGroup.add(pinMesh);

      if (isTop) {
        const ringGeom = new THREE.RingGeometry(0.25, 0.38, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(pos);
        ringMesh.lookAt(0, 0, 0);
        globeGroup.add(ringMesh);
      }
    });

    const activeV = selectedVessel || attribution?.top_candidate || candidateVessels[0];
    if (activeV?.full_voyage_path && activeV.full_voyage_path.length > 1) {
      const pts = activeV.full_voyage_path.map((coord) => latLonToVector3(coord[0], coord[1], 10, 0.15));
      const arcCurve = new THREE.CatmullRomCurve3(pts);
      const arcGeom = new THREE.TubeGeometry(arcCurve, 64, 0.08, 8, false);
      const arcMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const arcMesh = new THREE.Mesh(arcGeom, arcMat);
      globeGroup.add(arcMesh);
    }

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        if (autoRotate) {
          globeGroup.rotation.y += 0.003;
        } else {

          globeGroup.rotation.y += velocityRef.current.x * 0.05;
          globeGroup.rotation.x += velocityRef.current.y * 0.05;
          velocityRef.current.x *= 0.92;
          velocityRef.current.y *= 0.92;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const dom = containerRef.current;

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      velocityRef.current = { x: deltaX * 0.005, y: deltaY * 0.005 };
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(13, Math.min(45, camera.position.z + e.deltaY * 0.015));
    };

    dom.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    dom.addEventListener("wheel", handleWheel, { passive: false });

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      dom.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, [webglSupported, candidateVessels, selectedVessel, attribution, backwardDrift, forwardDrift, autoRotate]);

  if (!webglSupported) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[var(--bg-main)] p-6 text-center text-[var(--text-primary)]">
        <div className="h-14 w-14 rounded-2xl bg-[var(--bg-card-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold font-mono">3D WebGL Canvas Not Available</h3>
        <p className="text-xs text-[var(--text-secondary)] font-mono mt-1 max-w-md">
          Your browser environment does not support WebGL 3D context. Falling back to bounded 2D Planar projection.
        </p>
        <button
          onClick={onSwitchTo2D}
          className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white border border-[var(--border-color)] rounded-xl text-xs font-semibold font-mono flex items-center gap-2 cursor-pointer"
        >
          <MapIcon className="w-4 h-4" /> SWITCH TO BOUNDED 2D MAP
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden bg-[var(--bg-main)]">
      
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      <div className="absolute top-4 right-4 z-[1000] font-mono">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-md ${
            autoRotate
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-700"
              : "bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--bg-card-elevated)]"
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} /> AUTO ROTATION: {autoRotate ? "ON" : "OFF"}
        </button>
      </div>

      <div className="absolute bottom-6 left-6 z-[1000] bg-[var(--bg-card)] px-3.5 py-2 rounded-xl border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-3 shadow-md">
        <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold">
          <GlobeIcon className="w-4 h-4 text-[var(--text-primary)]" /> 3D SPHERICAL GLOBE PROJECTION (60 FPS)
        </span>
        <span className="text-[var(--text-muted)]">|</span>
        <span>Drag to rotate &bull; Scroll to zoom</span>
      </div>
    </div>
  );
}
