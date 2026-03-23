import * as THREE from 'three';
import type { StationData } from '../../data/stations';

const FLOAT_AMP = 0.12;
const FLOAT_FREQ = 0.6; // Hz
const ROT_SPEED  = 0.4; // rad/sec

const GLOW_BASE  = 0.8;
const GLOW_NEAR  = 3.0;
const GLOW_LERP  = 4.0; // lerp speed

export class StationBase {
  readonly group = new THREE.Group();
  readonly mesh: THREE.Mesh;
  readonly data: StationData;

  isNearby = false;

  private light: THREE.PointLight;
  private halo: THREE.Mesh;
  private floatTime: number;
  private currentGlow: number;

  constructor(data: StationData, geometry: THREE.BufferGeometry) {
    this.data = data;
    this.floatTime = Math.random() * Math.PI * 2; // randomise phase
    this.currentGlow = GLOW_BASE;

    // Main mesh
    const mat = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: new THREE.Color(data.color),
      emissiveIntensity: 0.3,
      metalness: 0.2,
      roughness: 0.5,
    });
    this.mesh = new THREE.Mesh(geometry, mat);
    this.mesh.castShadow = true;

    // Halo sphere
    const haloMat = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
      side: THREE.BackSide,
    });
    this.halo = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), haloMat);

    // Glow light
    this.light = new THREE.PointLight(data.color, GLOW_BASE, 8, 2);

    this.group.add(this.mesh, this.halo, this.light);
    this.group.position.set(...data.position);
  }

  update(delta: number) {
    this.floatTime += delta;

    // Float
    this.mesh.position.y = Math.sin(this.floatTime * FLOAT_FREQ * Math.PI * 2) * FLOAT_AMP;
    this.halo.position.y = this.mesh.position.y;

    // Rotate
    this.mesh.rotation.y += ROT_SPEED * delta;
    this.mesh.rotation.x += ROT_SPEED * 0.3 * delta;

    // Glow lerp
    const targetGlow = this.isNearby ? GLOW_NEAR : GLOW_BASE;
    this.currentGlow += (targetGlow - this.currentGlow) * GLOW_LERP * delta;
    this.light.intensity = this.currentGlow;

    // Emissive brightens when nearby
    const mat = this.mesh.material as THREE.MeshStandardMaterial;
    const targetEmissive = this.isNearby ? 0.7 : 0.3;
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * GLOW_LERP * delta;

    // Halo opacity
    const haloMat = this.halo.material as THREE.MeshBasicMaterial;
    const targetOpacity = this.isNearby ? 0.15 : 0.06;
    haloMat.opacity += (targetOpacity - haloMat.opacity) * GLOW_LERP * delta;
  }

  addTo(scene: THREE.Scene) {
    scene.add(this.group);
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.halo.geometry.dispose();
    (this.halo.material as THREE.Material).dispose();
  }
}
