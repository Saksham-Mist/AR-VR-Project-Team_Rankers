# Transformation Engine Documentation

## Overview

The transformation engine is responsible for constructing and applying 4x4 homogeneous transformation matrices to a 3D object.

The system explicitly constructs transformation matrices instead of relying on built-in engine transformation shortcuts.

---

## Homogeneous Transformation Matrix

Each transformation is represented as a 4x4 matrix:

| R11 R12 R13 Tx |
| R21 R22 R23 Ty |
| R31 R32 R33 Tz |
|  0   0   0  1  |

Where:
- R represents rotation components
- T represents translation components

---

## Implemented Transformations

### 1. Translation
Matrix constructed using displacement values along X, Y, Z.

### 2. Rotation
Rotation matrices constructed for:
- X-axis
- Y-axis
- Z-axis

Rotation order is controlled to avoid unintended compound effects.

### 3. Uniform Scaling
Scaling matrix applied equally across all axes.

---

## Order of Operations

Transformation order follows:

NewPosition = TransformationMatrix × CurrentPosition

Matrix multiplication order is carefully controlled to maintain predictable behavior.

---

## Local vs World Coordinates

The system maintains:
- Local object coordinate frame
- Global/world coordinate frame

Visualization of both frames enables comparison and intuitive understanding of transformation impact.
