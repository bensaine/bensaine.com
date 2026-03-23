import * as THREE from 'three';

/**
 * Cave layout — faithful to Plato's Allegory:
 *
 *   z=-45   Shadow wall (flat stone face, receives shadows)
 *   z=-45 → -25   Large shadow cove (wide chamber, player spawns here facing wall)
 *   z=-22   Ridge / low cliff (natural barrier the prisoners can't cross)
 *   z=-18 → -8   Raised object path (5 station objects sit here, casting shadows)
 *   z=-5    Fire (behind the objects, light shines forward toward wall)
 *   z=0 → +50   Exit passage (narrower, then widening to cave mouth and daylight)
 *
 * Fire light → objects → shadows on wall.
 * Player spawns at z≈-32, facing -Z (the wall). Turns around to see the fire.
 */

// Cave profile: [z, radius, xOffset, yOffset]
const PROFILE: [number, number, number, number][] = [
  // Shadow wall — tube curves down and pinches below the floor
  [-52,  4,    0, -8],    // pinch point well below floor (floor at y=-3)
  [-50,  10,    0, -4],    // curving down
  [-48,  16,    0, -1],    // transitioning up
  [-45,  18,    0,  0],    // shadow wall face
  [-40,  18,    0,  0],    // wide cove
  [-35,  19,  0,  0],    // widest point of cove
  [-30,  18,    0,  0],    // player spawn area
  [-25,  14,    0,  0],    // cove narrows toward ridge

  // Ridge / cliff barrier
  [-22,  11,  0,  0],    // narrow passage at the ridge

  // Object path — slightly wider chambers for station objects
  [-20,  13, -0.5, 0],  // station 1 alcove
  [-16,  10,    0,    0],  // narrow between stations
  [-12,  13,  0.5,  0],  // station 2 alcove
  [-8,   11,  0,    0],  // narrow

  // Fire chamber
  [-5,   14,    0,    0],  // fire sits here — wider so light spreads
  [-2,   12,    0,    0],  // past the fire

  // Exit passage — the path to freedom
  [2,    10,    0.3,  0],  // narrow exit start
  [8,    11, -0.3,  0],  // slight curve
  [15,   13,  0.5,  0],  // widening
  [25,   18,    0,    0],  // cave mouth begins
  [35,   24,   0,    0],  // mouth opens
  [50,   36,   0,    0],  // fully open to sky
];

const SEGMENTS_PER_SECTION = 4;
const RADIAL_SEGMENTS = 24;
const FLOOR_Y = -3;

function noise(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
  return n - Math.floor(n);
}

export class Cave {
  readonly group = new THREE.Group();

  constructor() {
    this.buildTunnel();
    this.buildFloor();
    this.buildRidge();
    this.buildAmbient();
  }

  addTo(scene: THREE.Scene) {
    scene.add(this.group);
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }

  private buildTunnel() {
    const rings: { z: number; radius: number; cx: number; cy: number }[] = [];

    for (let i = 0; i < PROFILE.length - 1; i++) {
      const [z0, r0, x0, y0] = PROFILE[i];
      const [z1, r1, x1, y1] = PROFILE[i + 1];
      for (let s = 0; s < SEGMENTS_PER_SECTION; s++) {
        const t = s / SEGMENTS_PER_SECTION;
        const st = t * t * (3 - 2 * t);
        rings.push({
          z: z0 + (z1 - z0) * t,
          radius: r0 + (r1 - r0) * st,
          cx: x0 + (x1 - x0) * st,
          cy: y0 + (y1 - y0) * st,
        });
      }
    }
    const last = PROFILE[PROFILE.length - 1];
    rings.push({ z: last[0], radius: last[1], cx: last[2], cy: last[3] });

    const ringCount = rings.length;
    const vertCount = ringCount * RADIAL_SEGMENTS;
    const positions = new Float32Array(vertCount * 3);

    for (let ri = 0; ri < ringCount; ri++) {
      const { z, radius, cx, cy } = rings[ri];
      for (let ai = 0; ai < RADIAL_SEGMENTS; ai++) {
        const angle = (ai / RADIAL_SEGMENTS) * Math.PI * 2;
        const idx = (ri * RADIAL_SEGMENTS + ai) * 3;

        let x = cx + Math.cos(angle) * radius;
        let y = cy + Math.sin(angle) * radius;

        // Perturb for organic feel (skip floor)
        if (y > FLOOR_Y + 0.5) {
          const perturbScale = 0.4;
          const n = (noise(x * 0.7, y * 0.7, z * 0.3) - 0.5) * 2;
          x += Math.cos(angle) * n * perturbScale;
          y += Math.sin(angle) * n * perturbScale;
        }

        positions[idx]     = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;
      }
    }

    const indexCount = (ringCount - 1) * RADIAL_SEGMENTS * 6;
    const indices = new Uint32Array(indexCount);
    let ii = 0;

    for (let ri = 0; ri < ringCount - 1; ri++) {
      for (let ai = 0; ai < RADIAL_SEGMENTS; ai++) {
        const nextAi = (ai + 1) % RADIAL_SEGMENTS;
        const curr = ri * RADIAL_SEGMENTS + ai;
        const next = ri * RADIAL_SEGMENTS + nextAi;
        const currNext = (ri + 1) * RADIAL_SEGMENTS + ai;
        const nextNext = (ri + 1) * RADIAL_SEGMENTS + nextAi;

        indices[ii++] = curr;
        indices[ii++] = currNext;
        indices[ii++] = next;
        indices[ii++] = next;
        indices[ii++] = currNext;
        indices[ii++] = nextNext;
      }
    }

    const geo = new THREE.BufferGeometry();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a1510,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    // Pole fan to close the tube — pinch point is below the floor
    const first = rings[0];
    const poleIdx = vertCount;
    const allPos = new Float32Array(vertCount * 3 + 3);
    allPos.set(positions);
    allPos[vertCount * 3]     = first.cx;
    allPos[vertCount * 3 + 1] = first.cy;
    allPos[vertCount * 3 + 2] = first.z;

    const fanIndices = new Uint32Array(RADIAL_SEGMENTS * 3);
    for (let ai = 0; ai < RADIAL_SEGMENTS; ai++) {
      const nextAi = (ai + 1) % RADIAL_SEGMENTS;
      fanIndices[ai * 3]     = poleIdx;
      fanIndices[ai * 3 + 1] = nextAi;
      fanIndices[ai * 3 + 2] = ai;
    }

    const allIndices = new Uint32Array(indices.length + fanIndices.length);
    allIndices.set(indices);
    allIndices.set(fanIndices, indices.length);

    geo.setAttribute('position', new THREE.BufferAttribute(allPos, 3));
    geo.setIndex(new THREE.BufferAttribute(allIndices, 1));
    geo.computeVertexNormals();

    const tunnel = new THREE.Mesh(geo, mat);
    tunnel.receiveShadow = true;
    this.group.add(tunnel);
  }

  private buildFloor() {
    const zMin = PROFILE[0][0];
    const zMax = PROFILE[PROFILE.length - 1][0];
    const length = zMax - zMin;
    const width = PROFILE[PROFILE.length - 1][1] * 2;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(width, length),
      new THREE.MeshStandardMaterial({ color: 0x110d0a, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.position.z = zMin + length / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
  }

  private buildRidge() {
    // Low stone ridge at z=-22 — the barrier between the prisoners and the objects
    // A rough box spanning the cave width
    const ridgeGeo = new THREE.BoxGeometry(10, 1.5, 2);
    const ridgeMat = new THREE.MeshStandardMaterial({
      color: 0x1e1812,
      roughness: 1,
    });
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.position.set(0, FLOOR_Y + 0.75, -22);
    ridge.castShadow = true;
    ridge.receiveShadow = true;
    this.group.add(ridge);
  }

  private buildAmbient() {
    const ambient = new THREE.AmbientLight(0x4a2f04, 200);
    this.group.add(ambient);
  }

}
