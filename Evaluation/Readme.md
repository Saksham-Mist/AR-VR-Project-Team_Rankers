📊 Evaluation & Performance Analysis

This directory documents the assessment framework used to evaluate the effectiveness, usability, performance, and scalability of the AR-Based Geometric Transformation Environment.

Evaluation is divided into four major areas:
	1.	Technical Performance
	2.	AR Module Performance
	3.	Learning Effectiveness
	4.	Usability & Interaction Quality


1. Technical Evaluation

A. Web Prototype Performance

The browser-based prototype was evaluated on:
	•	Rendering smoothness across all Platonic solids
	•	Real-time transformation and matrix update accuracy
	•	Responsiveness of translation, rotation, and scaling controls
	•	Stability during object switching and reset operations

Observed Results:
	•	Smooth 3D rendering using Three.js with negligible frame drops
	•	Instant and accurate transformation matrix updates
	•	Stable camera controls and object manipulation
	•	Seamless switching between Platonic solids without state corruption
	•	Reliable reset and transformation history functionality


B. Transformation System Validation

The transformation engine was evaluated for consistency and correctness:
	•	Uniform application of transformation logic across all geometries
	•	Accurate mapping between matrix values and object behavior
	•	Correct handling of composite transformations

Outcome:
	•	No inconsistencies observed between different solids
	•	Transformation pipeline proved scalable from cube (Phase 1) to all Platonic solids (Phase 2)
	•	Matrix visualization effectively reflects real-time transformations


2. AR Module Evaluation

The AR system (implemented using AR.js) was evaluated based on:
	•	Marker detection reliability
	•	Object anchoring accuracy
	•	AR-to-main scene transfer pipeline
	•	Performance under real-world conditions

Observed Results:
	•	Hiro marker detection is stable under normal lighting conditions
	•	Virtual objects are accurately anchored to the marker
	•	Object selection and transfer (AR → main scene) works correctly
	•	Data transfer using localStorage is fast and lightweight

Limitations:
	•	Detection accuracy decreases under poor lighting or partial occlusion
	•	Single marker limits automatic object differentiation
	•	AR and transformation environment are loosely coupled (manual confirmation required)

3. Performance Evaluation
	•	The system performs efficiently in a standard web browser
	•	No heavy computation (e.g., AI/ML) ensures:
	•	Fast load times
	•	Low resource consumption
	•	Compatibility with mid-range devices
	•	Real-time interaction remains smooth even with:
	•	Multiple geometry switches
	•	Continuous transformation updates
	•	Active matrix visualization


4. Learning Effectiveness Evaluation

The system is designed to enhance conceptual understanding of 3D transformations.

Key Evaluation Metrics
	•	Accuracy in predicting object movement after transformation
	•	Ability to interpret transformation matrices
	•	Understanding of coordinate system behavior
	•	Speed of grasping composite transformations

Observed Impact
	•	Improved intuition of spatial transformations through real-time interaction
	•	Stronger connection between matrix values and visual output
	•	Reduced reliance on trial-and-error learning
	•	Enhanced engagement due to AR-based visualization

Hypothesis

Students using this system will:
	•	Develop faster conceptual understanding
	•	Make fewer transformation-related errors
	•	Retain matrix–visual relationships more effectively

5. Usability & Interaction Evaluation

Web-Based Interface

Evaluated on:
	•	Clarity of UI layout
	•	Ease of transformation controls (sliders)
	•	Visualization of axes and object orientation
	•	Feedback via matrix display and history

Strengths Identified:
	•	Intuitive and user-friendly control system
	•	Clear axis representation and spatial orientation
	•	Immediate visual feedback for every transformation
	•	Effective separation of control panel and visualization space

Areas for Improvement:
	•	Enhanced breakdown of step-by-step transformations
	•	More advanced visual aids (face/edge highlighting)
	•	Improved AR interaction without manual confirmation


6. Limitations
	•	AR system relies on a single marker (Hiro marker)
	•	No immersive VR implementation yet
	•	No formal user study conducted
	•	Limited support for guided learning or adaptive difficulty
	•	AR and transformation modules are not fully integrated


7. Future Evaluation Plan

A structured comparative study is planned:

Control Group:
	•	Traditional 2D learning methods

Experimental Group:
	•	Interactive 3D + AR-based system

Metrics to Measure:
	•	Concept retention over time
	•	Error rate in transformation-based tasks
	•	Time required to complete problems
	•	User confidence and engagement levels


8. Evaluation Summary

The system demonstrates:
	•	Strong technical performance and stability
	•	Accurate real-time transformation and matrix synchronization
	•	Scalable architecture supporting multiple geometries
	•	Effective integration of AR for enhanced visualization

