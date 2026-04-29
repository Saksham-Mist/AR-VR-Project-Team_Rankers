# 3D Geometric Transformation Visualizer
### Interactive AR/VR Learning Environment for Linear Algebra

![Status](https://img.shields.io/badge/Status-Complete-success)
![Live](https://img.shields.io/badge/Live-Netlify-blue)
![Tech](https://img.shields.io/badge/Tech-Three.js%20%7C%20MediaPipe%20%7C%20AR.js-blueviolet)
![License](https://img.shields.io/badge/License-Academic-orange)

🎯 **Transform mathematics into intuition.** An interactive platform where geometric transformations become tangible, manipulable, and visually immersive.

---

## 🚀 Quick Links

- **[Live Demo](https://graphics-pipeline-visualiser.netlify.app/)** — Try it now
- **[Project Showcase](https://saksham-mist.github.io/AR-VR-Project-Team_Rankers/)** — Full documentation & team blogs
- **[Final Report](Proposal/3D_Transformation_Visualizer_Final_Report.pdf)** — Technical documentation

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Interaction Modes](#interaction-modes)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Performance](#performance)
- [Team & Credits](#team--credits)

---

## Overview

This project transforms **abstract mathematical concepts** into intuitive visual experiences through interactive 3D visualization and AR integration. Rather than learning transformations from textbooks, students:

- **Manipulate 3D objects in real-time** using multiple interaction methods
- **Visualize transformation matrices** being computed and decomposed
- **See coordinate spaces** transform (model → world → view → clip space)
- **Explore why matrix order matters** with visual demonstrations
- **Experience AR projections** of 3D transformations in physical space

Supports **5 Platonic solids** (cube, tetrahedron, octahedron, dodecahedron, icosahedron) across **3 distinct interaction modes**.

---

## Core Features

### 🎮 Desktop Environment
- **4-Viewport System** — Orthographic (top, front, right) + perspective views
- **Real-time Matrix Display** — T, R, S matrices updated live
- **Manual Sliders** — Control over translation, rotation, scaling
- **Shape Selection** — Switch between 5 Platonic solids
- **Cursor Control** — Click-drag, scroll, right-click pan
- **Synchronized Views** — All 4 perspectives update simultaneously

### 🖐️ Gesture Control Mode
- **Hand Tracking** — MediaPipe detects 21 hand landmarks
  - **Pinch** (thumb + index) → Scale
  - **Grab** (open hand) → Position
  - **Swipe** (hand motion) → Rotation
- **Gimbal Mode** — Device tilt (mobile) OR Arrow keys + Q/E (desktop)
- **Real-time Hand Visualization** — See landmarks on-screen
- **Manual Sliders** — Fine-tuning still available

### 📍 Augmented Reality (Hiro Marker)
- **Marker Detection** — AR.js detects Hiro marker
- **3D Visualization** — Cube, grid, basis vectors on marker
- **Linear Algebra Features**:
  - Transformation sequence buttons (T Only, T+R, T+R+S, Order Matters)
  - Model space cube (red, at origin)
  - Basis vectors (RGB colored axes)
  - Camera frustum visualization
- **State Sync** — Changes sync via localStorage

### 🧮 Linear Algebra Suite
- **Real-time Matrix Decomposition** — T × R × S visualization
- **Transformation Sequences** — Show composition step-by-step
- **Order Matters Demo** — Compares T×R×S vs S×R×T
- **Coordinate Spaces** — Model, world, view space indicators

---

## Interaction Modes

| Mode | File | Entry Point | Controls | Output |
|------|------|-------------|----------|--------|
| Desktop | index.html | Direct | Cursor + Sliders | 4 viewports + matrices |
| Gesture | ar-mode.html | Desktop → [START AR] | Hand gestures + Arrow keys | Single view + hand markers |
| AR | hiro-ar-mode.html | Gesture → [Hiro Mode] | Sliders (show Hiro marker) | AR scene on marker |

---

## Technology Stack

### Frontend
- **Three.js r128** — 3D rendering & math
- **MediaPipe** — Hand tracking
- **A-Frame + AR.js** — AR scene & marker detection
- **HTML5 / CSS3 / Vanilla JavaScript**

### APIs
- DeviceOrientationEvent (gimbal)
- Canvas 2D & WebGL
- localStorage (state sync)

### Deployment
- **Netlify** — Live app hosting
- **GitHub Pages** — Documentation site

---

## Setup & Installation

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Brave)
- Webcam (for gesture/AR)
- Hiro marker image for AR mode

### Local Development

```bash
# Clone and navigate
git clone https://github.com/Saksham-Mist/AR-VR-Project-Team_Rankers.git
cd Development/web_prototype

# Start server (Python)
python -m http.server 5500

# Or Node.js
npx http-server -p 5500

# Open browser
http://localhost:5500/index.html
```

---

## Usage Guide

### Desktop Mode
1. Open index.html
2. Use sliders to control T/R/S
3. Watch 4 views update in real-time
4. Observe matrix decomposition

### Gesture Control
1. From index.html → [START AR MODE]
2. Allow camera access
3. Make gestures: Pinch, Grab, Swipe
4. OR use arrow keys + Q/E for gimbal
5. Click [📍 Hiro Mode] to switch

### AR Mode
1. From gesture control → [📍 Hiro Mode]
2. Show Hiro marker to camera
3. Use sliders to transform object
4. Click transformation buttons
5. Click [🖐️ Switch to Gesture] to return

---

## Project Structure
AR-VR-Project-Team_Rankers/
├── Proposal/
├── Research/
├── Design/
├── Development/
│   └── web_prototype/
│       ├── index.html
│       ├── main.js
│       ├── ar-mode.html
│       ├── hiro-ar-mode.html
│       └── style.css
├── Evaluation/
├── BLOGS/
│   ├── Saksham_Weeks_1-5/
│   ├── Daivik_Weeks_1-5/
│   └── Shourya_Weeks_1-5/
├── Assets/
│   └── Screenshots/
├── 3D_Transformation_Visualizer_Final_Report.docx
└── README.md

---

## Performance

| Metric | Result | Device |
|--------|--------|--------|
| Desktop FPS | 60 FPS | Chrome/Firefox |
| Mobile FPS | 45-55 FPS | Android flagship |
| Hand Tracking Latency | 50-100 ms | Real-time |
| AR Detection | <1s | Up to 2m |
| Accuracy | ±5 cm drift | 5 min continuous |

### Browser Support

| Browser | Desktop | Gesture | AR |
|---------|---------|---------|-----|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ✅ | ⚠️ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Brave | ✅ | ✅ | ✅ |

---

## Known Limitations

| Issue | Workaround |
|-------|-----------|
| Mobile gimbal (Android) | Use keyboard fallback (arrow keys) |
| AR marker jitter | Smoothing filters applied |
| Hand tracking low light | Add external light source |
| iOS hand detection | Limited by browser; AR works fine |

---

## Team & Credits

### Development Team
- **Saksham Sharma** — Full-stack, gesture, gimbal
- **Daivik Pathak** — AR, LA visualization, coordinate spaces
- **Shourya Kapoor** — LA features, sequences, UI/UX

### Guidance
**Dr. Raghav B. Venkataramaiyer** — Project advisor

### Development Blogs
- [Saksham](https://sakshamsharma880460.substack.com/)
- [Daivik](https://daivikpathak.substack.com/)
- [Shourya](https://shouryakapoor.substack.com/)

---

## Documentation

- **[Final Report](Proposal/3D_Transformation_Visualizer_Final_Report.pdf)** — Technical documentation
- **[Project Showcase](https://saksham-mist.github.io/AR-VR-Project-Team_Rankers/)** — GitHub Pages site
- **[Live Demo](https://graphics-pipeline-visualiser.netlify.app/)** — Working application

---

## Future Enhancements

- [ ] Advanced hand gestures
- [ ] Multi-user AR sessions
- [ ] Physics simulation
- [ ] Voice control
- [ ] Object recognition
- [ ] WebXR support
- [ ] Custom geometry upload

---

## License

**Academic Project — For Educational Use Only**

---

## Support

- 🐛 [Open an issue](https://github.com/Saksham-Mist/AR-VR-Project-Team_Rankers/issues)
- 💡 [Start discussion](https://github.com/Saksham-Mist/AR-VR-Project-Team_Rankers/discussions)

---

**Last Updated:** April 2026 | **Status:** Complete ✅ | **Live:** https://graphics-pipeline-visualiser.netlify.app/
