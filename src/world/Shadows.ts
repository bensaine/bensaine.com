import * as THREE from 'three';

interface Puppet {
  mesh: THREE.Mesh;
  baseY: number;
  bobPhase: number;
  bobSpeed: number;
  rotSpeed: number;
}

function makeGraphShape(): THREE.BufferGeometry {
  // Simple cross/node cluster silhouette
  const shape = new THREE.Shape();
  shape.moveTo(-0.4, -0.05);
  shape.lineTo( 0.4, -0.05);
  shape.lineTo( 0.4,  0.05);
  shape.lineTo( 0.1,  0.05);
  shape.lineTo( 0.1,  0.4);
  shape.lineTo(-0.1,  0.4);
  shape.lineTo(-0.1,  0.05);
  shape.lineTo(-0.4,  0.05);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function makeNeuralShape(): THREE.BufferGeometry {
  // 3 stacked horizontal bars — layers of a network
  const shape = new THREE.Shape();
  const bar = (y: number) => {
    shape.moveTo(-0.35, y - 0.04);
    shape.lineTo( 0.35, y - 0.04);
    shape.lineTo( 0.35, y + 0.04);
    shape.lineTo(-0.35, y + 0.04);
    shape.closePath();
  };
  bar(0.3);
  bar(0);
  bar(-0.3);
  return new THREE.ShapeGeometry(shape);
}

function makeWaveShape(): THREE.BufferGeometry {
  // Zigzag waveform
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 0, 0),
    new THREE.Vector3(-0.3, 0.3, 0),
    new THREE.Vector3(-0.1, -0.3, 0),
    new THREE.Vector3( 0.1,  0.3, 0),
    new THREE.Vector3( 0.3, -0.3, 0),
    new THREE.Vector3( 0.5, 0, 0),
  ]);
  const points = curve.getPoints(32);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return geo;
}

function makePipelineShape(): THREE.BufferGeometry {
  // Arrow pointing right — pipeline flow
  const shape = new THREE.Shape();
  shape.moveTo(-0.45, -0.07);
  shape.lineTo( 0.1,  -0.07);
  shape.lineTo( 0.1,  -0.2);
  shape.lineTo( 0.45,  0);
  shape.lineTo( 0.1,   0.2);
  shape.lineTo( 0.1,   0.07);
  shape.lineTo(-0.45,  0.07);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function makeCircuitShape(): THREE.BufferGeometry {
  // Circle with a dot inside — eye/circuit motif
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 0.35, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.15, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return new THREE.ShapeGeometry(shape, 12);
}

export class Shadows {
  readonly group = new THREE.Group();
  private puppets: Puppet[] = [];
  private time = 0;

  constructor() {
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

    const shapes: THREE.BufferGeometry[] = [
      makeGraphShape(),
      makeNeuralShape(),
      makePipelineShape(),
      makeCircuitShape(),
    ];
    // waveform uses LineSegments, handled separately
    const waveGeo = makeWaveShape();

    // Puppets float on the object path (z=-18 to -8), near the station objects.
    // Fire at z=-5 shines forward, casting puppet shadows onto wall at z=-45.
    shapes.forEach((geo, i) => {
      const mesh = new THREE.Mesh(geo, mat.clone());
      const z = -17 + i * 2.5;
      const x = (i % 2 === 0 ? -1 : 1) * (1.0 + Math.random() * 0.5);
      mesh.position.set(x, 0.8, z);
      mesh.castShadow = true;
      mesh.scale.setScalar(1.5 + Math.random() * 0.5);
      this.group.add(mesh);
      this.puppets.push({
        mesh,
        baseY: mesh.position.y,
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: 0.4 + Math.random() * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.3,
      });
    });

    // Waveform puppet
    const waveLine = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({ color: 0x000000 }));
    waveLine.position.set(0, 1.0, -9);
    waveLine.castShadow = true;
    waveLine.scale.setScalar(2);
    this.group.add(waveLine);
  }

  update(delta: number) {
    this.time += delta;
    for (const p of this.puppets) {
      p.mesh.position.y = p.baseY + Math.sin(this.time * p.bobSpeed + p.bobPhase) * 0.08;
      p.mesh.rotation.z += p.rotSpeed * delta;
    }
  }

  addTo(scene: THREE.Scene) {
    scene.add(this.group);
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
    });
  }
}
