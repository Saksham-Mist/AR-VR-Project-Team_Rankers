console.log("main.js loaded - Day 2 Working");

/* DOM ELEMENTS */
const txInput = document.getElementById("tx");
const tyInput = document.getElementById("ty");
const tzInput = document.getElementById("tz");
const rxInput = document.getElementById("rx");
const ryInput = document.getElementById("ry");
const rzInput = document.getElementById("rz");
const sxInput = document.getElementById("sx");
const syInput = document.getElementById("sy");
const szInput = document.getElementById("sz");

const matrixDisplay = document.getElementById("matrixDisplay");
const historyDiv = document.getElementById("history");
const dataInfoDiv = document.getElementById("dataInfo");
const arStatusDiv = document.getElementById("arStatus");
const axesToggle = document.getElementById("axesToggle");
const breakdownToggle = document.getElementById("breakdownToggle");
// const datasetSelect = document.getElementById("datasetSelect");
const modeToggleBtn = document.getElementById("modeToggle");
const sceneContainer = document.getElementById("scene");
const controlsContainer = document.getElementById("controls");

// /* DATASETS */
// const datasets = {
//   A: { x: 1.2, y: 0.8, z: 1.5 },
//   B: { x: 0.9, y: 1.4, z: 1.1 },
//   C: { x: 1.5, y: 1.2, z: 0.7 }
// };

/* NORMAL MODE - THREE.JS SCENE */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

/* ========== 4 VIEWPORT SETUP ========== */
const w = window.innerWidth * 0.75;
const h = window.innerHeight;

const cameras = {
  model: new THREE.PerspectiveCamera(75, w/h, 0.1, 1000),
  world: new THREE.PerspectiveCamera(75, w/h, 0.1, 1000),
  view: new THREE.PerspectiveCamera(75, w/h, 0.1, 1000),
  clip: new THREE.PerspectiveCamera(75, w/h, 0.1, 1000)
};

cameras.model.position.set(3, 3, 3);
cameras.world.position.set(4, 4, 6);
cameras.view.position.set(0, 0, 8);
cameras.clip.position.set(5, 5, 5);

Object.values(cameras).forEach(cam => cam.lookAt(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
renderer.autoClear = false;
sceneContainer.appendChild(renderer.domElement);

/* VIEWPORT LABELS */
const labelCanvas = document.createElement('canvas');
labelCanvas.width = w;
labelCanvas.height = h;
labelCanvas.style.position = 'absolute';
labelCanvas.style.top = '0';
labelCanvas.style.left = '0';
labelCanvas.style.pointerEvents = 'none';
sceneContainer.style.position = 'relative';
sceneContainer.appendChild(labelCanvas);

const ctx = labelCanvas.getContext('2d');
ctx.fillStyle = '#3fa7ff';
ctx.font = 'bold 14px Segoe UI';
ctx.fillText('MODEL', 20, 25);
ctx.fillText('WORLD', w/2 + 20, 25);
ctx.fillText('VIEW', 20, h/2 + 25);
ctx.fillText('CLIP', w/2 + 20, h/2 + 25);


/* CAMERA POSITION & FRUSTUM */
const camXInput = document.getElementById("camX");
const camYInput = document.getElementById("camY");
const camZInput = document.getElementById("camZ");

let cameraPos = { x: 0, y: 0, z: 8 };

function updateCameraPosition() {
  cameraPos.x = parseFloat(camXInput.value);
  cameraPos.y = parseFloat(camYInput.value);
  cameraPos.z = parseFloat(camZInput.value);
  
  cameras.view.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
  cameras.view.lookAt(0, 0, 0);
  
  if (cameraHelper) cameraHelper.update();
}

const cameraHelper = new THREE.CameraHelper(cameras.view);
scene.add(cameraHelper);

camXInput.oninput = camYInput.oninput = camZInput.oninput = updateCameraPosition;
updateCameraPosition();

camXInput.oninput = camYInput.oninput = camZInput.oninput = updateCameraPosition;
updateCameraPosition();


/* LIGHTING */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

/* GRID & AXES */
const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/* STATE */
let cube = null;
let currentShapeType = "box";
let showBreakdown = true;
let arActive = false;
let arScene = null;
let arCamera = null;
let arRenderer = null;
let arToolkitContext = null;
let arMarkerControls = null;
let arCube = null;

/* CREATE SHAPE */
function createShape(shapeType) {
  if (cube) scene.remove(cube);

  let geometry;

  switch (shapeType) {
    case "tetrahedron":
      geometry = new THREE.TetrahedronGeometry(1.5);
      break;
    case "octahedron":
      geometry = new THREE.OctahedronGeometry(1.5);
      break;
    case "dodecahedron":
      geometry = new THREE.DodecahedronGeometry(1);
      break;
    case "icosahedron":
      geometry = new THREE.IcosahedronGeometry(1.5);
      break;
    case "box":
    default:
      geometry = new THREE.BoxGeometry();
  }

  const material = new THREE.MeshStandardMaterial({
  color: 0x3fa7ff,
  metalness: 0.3,
  roughness: 0.3,
  emissive: 0x0066ff,
  emissiveIntensity: 0.3
});

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  currentShapeType = shapeType;
  updateTransformation();
}

createShape("box");

/* GHOST */
const ghostGeometry = new THREE.BoxGeometry();
const ghostMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.2
});
const ghostCube = new THREE.Mesh(ghostGeometry, ghostMaterial);
scene.add(ghostCube);

/* UPDATE TRANSFORMATION */
function updateTransformation() {
  if (!cube) return;

  const tx = parseFloat(txInput.value);
  const ty = parseFloat(tyInput.value);
  const tz = parseFloat(tzInput.value);

  const rx = THREE.MathUtils.degToRad(parseFloat(rxInput.value));
  const ry = THREE.MathUtils.degToRad(parseFloat(ryInput.value));
  const rz = THREE.MathUtils.degToRad(parseFloat(rzInput.value));

  const sx = parseFloat(sxInput.value);
  const sy = parseFloat(syInput.value);
  const sz = parseFloat(szInput.value);

  cube.position.set(tx, ty, tz);
  cube.rotation.set(rx, ry, rz);
  cube.scale.set(sx, sy, sz);

  cube.updateMatrix();

  updateDataInfo(sx, sy, sz);
  updateColor(sx, sy, sz);
  displayMatrix(cube.matrix.elements);

  logTransformation(tx, ty, tz, rxInput.value, ryInput.value, rzInput.value, sx, sy, sz);

  /* Also update AR cube if it exists */
  if (arCube && arActive) {
    arCube.position.set(tx, ty, tz);
    arCube.rotation.set(rx, ry, rz);
    arCube.scale.set(sx, sy, sz);
  }
  // Save to localStorage for AR sync
  const arState = {
    tx: txInput.value,
    ty: tyInput.value,
    tz: tzInput.value,
    rx: rxInput.value,
    ry: ryInput.value,
    rz: rzInput.value,
    sx: sxInput.value,
    sy: syInput.value,
    sz: szInput.value,
    camX: camXInput.value,
    camY: camYInput.value,
    camZ: camZInput.value
  };
  localStorage.setItem("arCameraState", JSON.stringify(arState));
  displayDecomposedMatrices();
}

function updateColor(x, y, z) {
  if (!cube) return;
  const intensity = Math.min((x + y + z) / 3, 1);
  cube.material.color.setRGB(intensity, 0.2, 1 - intensity);
}

function updateDataInfo(x, y, z) {
  if (!dataInfoDiv) return;
  dataInfoDiv.innerHTML = `Feature A: ${x.toFixed(2)} <br>Feature B: ${y.toFixed(2)} <br>Feature C: ${z.toFixed(2)}`;
}

function displayMatrix(m) {
  let matrixText = "";
  for (let i = 0; i < 4; i++) {
    matrixText += m[i].toFixed(2) + "   " + m[i + 4].toFixed(2) + "   " + m[i + 8].toFixed(2) + "   " + m[i + 12].toFixed(2) + "\n";
  }
  if (showBreakdown) {
    matrixText += "\n--- Matrix Breakdown ---\n";
    matrixText += "Row 1 → X basis\n";
    matrixText += "Row 2 → Y basis\n";
    matrixText += "Row 3 → Z basis\n";
    matrixText += "Col 4 → Translation\n";
  }
  matrixDisplay.textContent = matrixText;
}

function logTransformation(tx, ty, tz, rx, ry, rz, sx, sy, sz) {
  const entry = document.createElement("div");
  entry.style.fontSize = "11px";
  entry.style.marginBottom = "4px";
  entry.style.color = "#9ca3af";
  entry.textContent = `T(${parseFloat(tx).toFixed(1)}, ${parseFloat(ty).toFixed(1)}, ${parseFloat(tz).toFixed(1)}) R(${parseInt(rx)}°, ${parseInt(ry)}°, ${parseInt(rz)}°) S(${parseFloat(sx).toFixed(2)}, ${parseFloat(sy).toFixed(2)}, ${parseFloat(sz).toFixed(2)})`;
  historyDiv.insertBefore(entry, historyDiv.firstChild);
  if (historyDiv.children.length > 10) {
    historyDiv.removeChild(historyDiv.lastChild);
  }
}

function changeShape(shape) {
  createShape(shape);
}

function resetObject() {
  txInput.value = 0;
  tyInput.value = 0;
  tzInput.value = 0;
  rxInput.value = 0;
  ryInput.value = 0;
  rzInput.value = 0;
  sxInput.value = 1;
  syInput.value = 1;
  szInput.value = 1;
  
  camXInput.value = 0;
  camYInput.value = 0;
  camZInput.value = 8;
  
  updateTransformation();
  updateCameraPosition();
}

function toggleAxes(state) {
  axesHelper.visible = state;
}

function toggleBreakdown(state) {
  showBreakdown = state;
  updateTransformation();
}

function applyDataset(data) {
  sxInput.value = data.x;
  syInput.value = data.y;
  szInput.value = data.z;
  updateTransformation();
}

/* ========== AR MODE ========== */
function toggleARMode() {
  window.location.href = "ar-mode.html";
}

function startAR() {}
function stopAR() {}
function animateAR() {}

function startAR() {
  arActive = true;
  modeToggleBtn.textContent = "⏹️ STOP AR MODE";
  modeToggleBtn.style.background = "#ef4444";
  arStatusDiv.textContent = "🟡 Starting AR...";
  arStatusDiv.style.color = "#fbbf24";

  /* Hide normal UI */
  sceneContainer.style.display = "none";
  controlsContainer.style.display = "none";

  /* Create AR container */
  const arContainer = document.createElement("div");
  arContainer.id = "arContainer";
  arContainer.style.width = "100vw";
  arContainer.style.height = "100vh";
  arContainer.style.position = "absolute";
  arContainer.style.top = "0";
  arContainer.style.left = "0";
  document.body.appendChild(arContainer);

  /* AR Scene & Camera */
  arScene = new THREE.Scene();
  arCamera = new THREE.Camera();

  /* AR Renderer */
  arRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  arRenderer.setSize(window.innerWidth, window.innerHeight);
  arRenderer.setPixelRatio(window.devicePixelRatio);
  arContainer.appendChild(arRenderer.domElement);

  /* Initialize AR.js */
  THREEx.ArToolkitContext.baseURL = "https://cdn.jsdelivr.net/npm/ar.js@3.4.5/three.js/";

  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "camera_para.dat",
    detectionMode: "mono",
    maxDetectionRate: 30,
    canvasWidth: 80 * 3,
    canvasHeight: 60 * 3
  });

  arToolkitContext.init(() => {
    console.log("✅ AR Context Ready");

    arCamera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

    /* Marker Controls */
    arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, arCamera, {
      type: "pattern",
      patternUrl: "https://cdn.jsdelivr.net/npm/ar.js@3.4.5/data/data/patt.hiro"
    });

    /* Create AR Cube */
    const tx = parseFloat(txInput.value);
    const ty = parseFloat(tyInput.value);
    const tz = parseFloat(tzInput.value);
    const rx = THREE.MathUtils.degToRad(parseFloat(rxInput.value));
    const ry = THREE.MathUtils.degToRad(parseFloat(ryInput.value));
    const rz = THREE.MathUtils.degToRad(parseFloat(rzInput.value));
    const sx = parseFloat(sxInput.value);
    const sy = parseFloat(syInput.value);
    const sz = parseFloat(szInput.value);

    let geometry;
    switch (currentShapeType) {
      case "tetrahedron":
        geometry = new THREE.TetrahedronGeometry(1.5);
        break;
      case "octahedron":
        geometry = new THREE.OctahedronGeometry(1.5);
        break;
      case "dodecahedron":
        geometry = new THREE.DodecahedronGeometry(1);
        break;
      case "icosahedron":
        geometry = new THREE.IcosahedronGeometry(1.5);
        break;
      default:
        geometry = new THREE.BoxGeometry();
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0x3fa7ff,
      metalness: 0.2,
      roughness: 0.4
    });

    arCube = new THREE.Mesh(geometry, material);
    arCube.position.set(tx, ty, tz);
    arCube.rotation.set(rx, ry, rz);
    arCube.scale.set(sx, sy, sz);

    /* Add lights to AR scene */
    const arLight = new THREE.AmbientLight(0xffffff, 0.8);
    arScene.add(arLight);

    const arDirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    arDirLight.position.set(5, 10, 7);
    arScene.add(arDirLight);

    /* Add cube to marker */
    arMarkerControls.object3d.add(arCube);
    arScene.add(arMarkerControls.object3d);

    arStatusDiv.textContent = "🟢 AR ACTIVE - Show Hiro marker";
    arStatusDiv.style.color = "#10b981";

    /* Start AR Loop */
    animateAR();
  });
}

function animateAR() {
  requestAnimationFrame(animateAR);

  if (arToolkitContext) {
    arToolkitContext.update(arRenderer.domElement);
  }

  arRenderer.render(arScene, arCamera);
}

function stopAR() {
  arActive = false;
  modeToggleBtn.textContent = "📷 START AR MODE";
  modeToggleBtn.style.background = "#10b981";
  arStatusDiv.textContent = "🔴 AR Off";
  arStatusDiv.style.color = "#ef4444";

  /* Clean up AR */
  if (document.getElementById("arContainer")) {
    document.getElementById("arContainer").remove();
  }

  if (arRenderer) {
    arRenderer.dispose();
  }

  arToolkitContext = null;
  arMarkerControls = null;
  arCube = null;

  /* Show normal UI */
  sceneContainer.style.display = "block";
  controlsContainer.style.display = "block";

  animate();
}

/* EVENT LISTENERS */
txInput.oninput = tyInput.oninput = tzInput.oninput =
rxInput.oninput = ryInput.oninput = rzInput.oninput =
sxInput.oninput = syInput.oninput = szInput.oninput =
updateTransformation;

axesToggle.onchange = (e) => toggleAxes(e.target.checked);
breakdownToggle.onchange = (e) => toggleBreakdown(e.target.checked);

// datasetSelect.addEventListener("change", (e) => {
//   if (datasets[e.target.value]) {
//     applyDataset(datasets[e.target.value]);
//   }
// });

/* GUIDED MODE PRESETS */
function preset(scenario) {
  if (scenario === 'rotate') {
    rxInput.value = 45;
    camXInput.value = 0;
    camYInput.value = 0;
    camZInput.value = 8;
  } else if (scenario === 'camera') {
    rxInput.value = 0;
    camXInput.value = 5;
    camYInput.value = 3;
    camZInput.value = 5;
  } else if (scenario === 'scale') {
    sxInput.value = 2;
    syInput.value = 2;
    szInput.value = 2;
    camXInput.value = 0;
    camYInput.value = 0;
    camZInput.value = 12;
  } else if (scenario === 'behind') {
    rxInput.value = 0;
    camXInput.value = 0;
    camYInput.value = 0;
    camZInput.value = -3;
  }
  updateTransformation();
  updateCameraPosition();
}

function formatMatrix(m) {
  let str = '';
  for (let i = 0; i < 4; i++) {
    str += m[i].toFixed(2) + ' ' + m[i+4].toFixed(2) + ' ' + m[i+8].toFixed(2) + ' ' + m[i+12].toFixed(2) + '\n';
  }
  return str;
}

/* SAVE CAMERA STATE TO AR */
function saveCameraState() {
  const state = {
    camX: camXInput.value,
    camY: camYInput.value,
    camZ: camZInput.value,
    tx: txInput.value,
    ty: tyInput.value,
    tz: tzInput.value
  };
  localStorage.setItem("arCameraState", JSON.stringify(state));
}

camXInput.oninput = camYInput.oninput = camZInput.oninput = () => {
  updateCameraPosition();
  saveCameraState();
};

/* ========== LINEAR ALGEBRA: DECOMPOSED MATRICES ========== */
function createTranslationMatrix(tx, ty, tz) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, tz, 1
  ];
}

function createRotationMatrix(rx, ry, rz) {
  const m = new THREE.Matrix4();
  m.makeRotationFromEuler(new THREE.Euler(rx, ry, rz));
  return m.elements;
}

function createScaleMatrix(sx, sy, sz) {
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1
  ];
}

function multiplyMatrices(a, b) {
  let result = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
      }
    }
  }
  return result;
}

function formatMatrixDisplay(m) {
  let str = '';
  for (let i = 0; i < 4; i++) {
    str += m[i].toFixed(2) + '  ' + m[i+4].toFixed(2) + '  ' + m[i+8].toFixed(2) + '  ' + m[i+12].toFixed(2) + '\n';
  }
  return str;
}

function displayDecomposedMatrices() {
  const tx = parseFloat(txInput.value);
  const ty = parseFloat(tyInput.value);
  const tz = parseFloat(tzInput.value);
  const rx = THREE.MathUtils.degToRad(parseFloat(rxInput.value));
  const ry = THREE.MathUtils.degToRad(parseFloat(ryInput.value));
  const rz = THREE.MathUtils.degToRad(parseFloat(rzInput.value));
  const sx = parseFloat(sxInput.value);
  const sy = parseFloat(syInput.value);
  const sz = parseFloat(szInput.value);

  const T = createTranslationMatrix(tx, ty, tz);
  const R = createRotationMatrix(rx, ry, rz);
  const S = createScaleMatrix(sx, sy, sz);
  
  const TR = multiplyMatrices(T, R);
  const TRS = multiplyMatrices(TR, S);

  const decomposedText = `
--- Translation Matrix (T) ---
${formatMatrixDisplay(T)}
--- Rotation Matrix (R) ---
${formatMatrixDisplay(R)}
--- Scale Matrix (S) ---
${formatMatrixDisplay(S)}
--- Composed: T × R × S ---
${formatMatrixDisplay(TRS)}`;

  const decomposedDiv = document.getElementById('decomposedMatrices');
  if (decomposedDiv) {
    decomposedDiv.textContent = decomposedText;
  }

  // Save for AR
  const arMatrixState = {
    finalMatrix: TRS,
    tx, ty, tz, rx, ry, rz, sx, sy, sz
  };
  localStorage.setItem("arMatrixState", JSON.stringify(arMatrixState));
}

/* ANIMATION */
/* ========== CURSOR & CAMERA CONTROL ========== */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let isDraggingCamera = false;
let dragOffset = new THREE.Vector3();
let lastMouseX = 0;
let lastMouseY = 0;

const viewCamera = cameras.view;
const viewCanvas = renderer.domElement;

function updateMouseCoords(event) {
  const rect = viewCanvas.getBoundingClientRect();
  const vw = rect.width / 2;
  const vh = rect.height / 2;
  
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  
  // Normalize to View viewport (bottom-left)
  mouse.x = ((localX % vw) / vw) * 2 - 1;
  mouse.y = -((localY - vh) / vh) * 2 + 1;
}

viewCanvas.addEventListener('mousedown', (event) => {
  const rect = viewCanvas.getBoundingClientRect();
  const vw = rect.width / 2;
  const vh = rect.height / 2;
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  
  if (event.button === 0) {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    console.log("Cube drag started");
  }
  else if (event.button === 2) {
    event.preventDefault();
    isDraggingCamera = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    console.log("Camera drag started");
  }
});

viewCanvas.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;
    
    cube.position.x += dx * 0.05;
    cube.position.y -= dy * 0.05;
    
    txInput.value = cube.position.x.toFixed(2);
    tyInput.value = cube.position.y.toFixed(2);
    tzInput.value = cube.position.z.toFixed(2);
    
    updateTransformation();
    
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
  
  if (isDraggingCamera) {
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;
    
    camXInput.value = (parseFloat(camXInput.value) + dx * 0.05).toFixed(2);
    camYInput.value = (parseFloat(camYInput.value) - dy * 0.05).toFixed(2);
    
    updateCameraPosition();
    updateTransformation();
    
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }
});

viewCanvas.addEventListener('mouseup', () => {
  isDragging = false;
  isDraggingCamera = false;
  console.log("Drag ended");
});

viewCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
viewCanvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  
  const dz = event.deltaY > 0 ? 0.5 : -0.5;
  cube.position.z += dz;
  
  tzInput.value = cube.position.z.toFixed(2);
  updateTransformation();
}, { passive: false });

function animate() {
  requestAnimationFrame(animate);
  
  const w = window.innerWidth * 0.75;
  const h = window.innerHeight;
  const vw = w / 2;
  const vh = h / 2;
  
  renderer.clear();
  
  renderer.setScissorTest(true);
  
  // Model
  renderer.setScissor(0, vh, vw, vh);
  renderer.setViewport(0, vh, vw, vh);
  renderer.render(scene, cameras.model);
  
  // World
  renderer.setScissor(vw, vh, vw, vh);
  renderer.setViewport(vw, vh, vw, vh);
  renderer.render(scene, cameras.world);
  
  // View
  renderer.setScissor(0, 0, vw, vh);
  renderer.setViewport(0, 0, vw, vh);
  renderer.render(scene, cameras.view);
  
  // Clip
  renderer.setScissor(vw, 0, vw, vh);
  renderer.setViewport(vw, 0, vw, vh);
  renderer.render(scene, cameras.clip);
  
  renderer.setScissorTest(false);
}

/* RESIZE */
window.addEventListener("resize", () => {
  const w = window.innerWidth * 0.75;
  const h = window.innerHeight;
  
  Object.values(cameras).forEach(cam => {
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  });
  
  renderer.setSize(w, h);
});

/* START */
console.log("✅ Ready");
animate();

function saveStateToAR() {
  const state = {
    shape: currentShapeType,
    tx: txInput.value,
    ty: tyInput.value,
    tz: tzInput.value,
    rx: rxInput.value,
    ry: ryInput.value,
    rz: rzInput.value,
    sx: sxInput.value,
    sy: syInput.value,
    sz: szInput.value
  };
  localStorage.setItem("arState", JSON.stringify(state));
}

txInput.oninput = tyInput.oninput = tzInput.oninput =
rxInput.oninput = ryInput.oninput = rzInput.oninput =
sxInput.oninput = syInput.oninput = szInput.oninput = () => {
  updateTransformation();
  saveStateToAR();
  displayViewportMatrices();
};

function displayViewportMatrices() {
  const modelMatrix = cube.matrix.elements;
  const viewMatrix = cameras.view.matrixWorldInverse.elements;
  
  const text = `Model:\n${formatMatrix(modelMatrix)}\n\nView:\n${formatMatrix(viewMatrix)}`;
  matrixDisplay.textContent = text;
}

updateTransformation();

/* RESTORE SLIDER STATE ON PAGE LOAD */
const saved = JSON.parse(localStorage.getItem("allSliders"));
if (saved) {
  txInput.value = saved.tx;
  tyInput.value = saved.ty;
  tzInput.value = saved.tz;
  rxInput.value = saved.rx;
  ryInput.value = saved.ry;
  rzInput.value = saved.rz;
  sxInput.value = saved.sx;
  syInput.value = saved.sy;
  szInput.value = saved.sz;
  camXInput.value = saved.camX;
  camYInput.value = saved.camY;
  camZInput.value = saved.camZ;
  updateTransformation();
  updateCameraPosition();
}

/* SAVE SLIDER STATE ON PAGE UNLOAD */
window.addEventListener('beforeunload', () => {
  const state = {
    tx: txInput.value, ty: tyInput.value, tz: tzInput.value,
    rx: rxInput.value, ry: ryInput.value, rz: rzInput.value,
    sx: sxInput.value, sy: syInput.value, sz: szInput.value,
    camX: camXInput.value, camY: camYInput.value, camZ: camZInput.value
  };
  localStorage.setItem("allSliders", JSON.stringify(state));
});