console.log("main.js loaded");

/* 🔥 DATASETS */
const datasets = {
  A: { x: 1.2, y: 0.8, z: 1.5 },
  B: { x: 0.9, y: 1.4, z: 1.1 },
  C: { x: 1.5, y: 1.2, z: 0.7 }
};

const scene = new THREE.Scene();

function createDetectedObject(shape) {
  if (cube) scene.remove(cube);

  let geometry;

  switch (shape) {
    case "tetrahedron":
      geometry = new THREE.TetrahedronGeometry();
      break;
    case "box":
      geometry = new THREE.BoxGeometry();
      break;
    case "octahedron":
      geometry = new THREE.OctahedronGeometry();
      break;
    case "dodecahedron":
      geometry = new THREE.DodecahedronGeometry();
      break;
    case "icosahedron":
      geometry = new THREE.IcosahedronGeometry();
      break;
    default:
      geometry = new THREE.BoxGeometry();
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0xff6b6b
  });

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  updateTransformation(); // 🔥 ensure data + color applies
}

scene.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

/* LIGHTING */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

/* GRID & AXES */
const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/* MAIN OBJECT */
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0x3fa7ff,
  metalness: 0.2,
  roughness: 0.4
});

let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/* GHOST */
const ghostMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.4
});
const ghostCube = new THREE.Mesh(geometry, ghostMaterial);
scene.add(ghostCube);

/* CAMERA */
camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);

let showBreakdown = true;

/* 🔥 MAIN UPDATE FUNCTION */
function updateTransformation() {
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

  /* 🔥 DATA VISUALIZATION HOOK */
  updateDataInfo(sx, sy, sz);
  updateColor(sx, sy, sz);

  cube.updateMatrix();
  displayMatrix(cube.matrix.elements);

  logTransformation(
    tx,
    ty,
    tz,
    rxInput.value,
    ryInput.value,
    rzInput.value,
    sx,
    sy,
    sz
  );
}

/* 🔥 DATA DISPLAY */
function updateDataInfo(x, y, z) {
  const info = document.getElementById("dataInfo");
  if (!info) return;

  info.innerHTML = `
    Feature A: ${x.toFixed(2)} <br>
    Feature B: ${y.toFixed(2)} <br>
    Feature C: ${z.toFixed(2)}
  `;
}

/* 🔥 COLOR MAPPING */
function updateColor(x, y, z) {
  if (!cube) return;

  const intensity = (x + y + z) / 3;

  cube.material.color.setRGB(
    intensity,
    0.2,
    1 - intensity
  );
}

/* 🔥 APPLY DATASET */
function applyDataset(data) {
  sxInput.value = data.x;
  syInput.value = data.y;
  szInput.value = data.z;

  updateTransformation();
}

/* MATRIX DISPLAY */
function displayMatrix(m) {
  let matrixText = "";

  for (let i = 0; i < 4; i++) {
    matrixText +=
      m[i].toFixed(2) + "   " +
      m[i + 4].toFixed(2) + "   " +
      m[i + 8].toFixed(2) + "   " +
      m[i + 12].toFixed(2) + "\n";
  }

  if (showBreakdown) {
    matrixText += "\nMatrix Breakdown:\n";
    matrixText += "Row 1 → X basis\n";
    matrixText += "Row 2 → Y basis\n";
    matrixText += "Row 3 → Z basis\n";
    matrixText += "Column 4 → Translation\n";
  }

  matrixDisplay.textContent = matrixText;
}

/* RESET */
function resetObject() {
  if (cube) scene.remove(cube);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00
  });

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.set(0, 0, 0);
  cube.rotation.set(0, 0, 0);
  cube.scale.set(1, 1, 1);

  updateTransformation();
}

/* TOGGLES */
function toggleAxes(state) {
  axesHelper.visible = state;
}

function toggleBreakdown(state) {
  showBreakdown = state;
  updateTransformation();
}

/* HISTORY */
function logTransformation(tx, ty, tz, rx, ry, rz, sx, sy, sz) {
  const entry = document.createElement("div");
  entry.textContent =
    `T(${tx}, ${ty}, ${tz})  R(${rx}°, ${ry}°, ${rz}°)  S(${sx}, ${sy}, ${sz})`;
  historyDiv.appendChild(entry);
}

/* ELEMENTS */
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

/* 🔥 DATASET DROPDOWN */
const datasetSelect = document.getElementById("datasetSelect");
if (datasetSelect) {
  datasetSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (datasets[val]) {
      applyDataset(datasets[val]);
    }
  });
}

/* EVENTS */
txInput.oninput = tyInput.oninput = tzInput.oninput =
rxInput.oninput = ryInput.oninput = rzInput.oninput =
sxInput.oninput = syInput.oninput = szInput.oninput =
updateTransformation;

/* ANIMATION */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

/* AR SYNC */
const selectedShape = localStorage.getItem("selectedShape");

if (selectedShape) {
  createDetectedObject(selectedShape);
  localStorage.removeItem("selectedShape");
}

/* START */
animate();
updateTransformation();

/* NAV */
function openAR() {
  window.location.href = "ar.html";
}
