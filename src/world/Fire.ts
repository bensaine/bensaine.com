import * as THREE from 'three';

const PARTICLE_COUNT = 200;

function makeSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,200,1)');
  grad.addColorStop(0.3, 'rgba(255,80,20,0.8)');
  grad.addColorStop(1, 'rgba(200,10,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export class Fire {
  readonly group = new THREE.Group();

  private positions: Float32Array;
  private velocities: Float32Array;
  private phases: Float32Array;
  private lifetimes: Float32Array;
  private points: THREE.Points;
  private sprite: THREE.Texture;

  // Lights owned by fire (moved out of Cave.ts)
  readonly mainLight: THREE.PointLight;
  readonly flickerLight: THREE.PointLight;

  private flickerTime = 0;

  constructor() {
    // Particle geometry
    this.positions = new Float32Array(PARTICLE_COUNT * 3);
    this.velocities = new Float32Array(PARTICLE_COUNT * 3);
    this.phases = new Float32Array(PARTICLE_COUNT);
    this.lifetimes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.spawn(i);
      // stagger initial lifetimes so they don't all reset at once
      this.lifetimes[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.sprite = makeSprite();
    const mat = new THREE.PointsMaterial({
      size: 0.55,
      map: this.sprite,
      vertexColors: false,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xff8833,
    });

    this.points = new THREE.Points(geo, mat);
    this.group.add(this.points);

    // Fire lights
    this.mainLight = new THREE.PointLight(0xff8833, 5, 0, 0);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.set(2048, 2048);
    this.mainLight.shadow.bias = -0.001;
    this.mainLight.shadow.radius = 2;

    this.flickerLight = new THREE.PointLight(0xff6622, 50, 0, 2);
    this.flickerLight.position.set(0.5, 0.3, 0);

    this.group.add(this.mainLight, this.flickerLight);

    // Fire sits BEHIND the objects — light shines forward toward wall
    this.group.position.set(0, -1.5, -5);
  }

  private spawn(i: number) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.6;
    this.positions[i * 3]     = Math.cos(angle) * r;
    this.positions[i * 3 + 1] = 0;
    this.positions[i * 3 + 2] = Math.sin(angle) * r;

    this.velocities[i * 3]     = (Math.random() - 0.5) * 0.3;
    this.velocities[i * 3 + 1] = 1.0 + Math.random() * 2.5;
    this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

    this.phases[i] = Math.random() * Math.PI * 2;
    this.lifetimes[i] = 0;
  }

  update(delta: number) {
    this.flickerTime += delta;
    const t = this.flickerTime;

    // Flicker lights
    const flicker =
      0.85 +
      0.08 * Math.sin(t * 13.7) +
      0.05 * Math.sin(t * 27.3) +
      0.04 * Math.sin(t * 6.1);
    this.mainLight.intensity = 5 * flicker;
    this.flickerLight.intensity = 2 * (1 - flicker * 0.3);
    this.flickerLight.position.x = 0.5 + 0.15 * Math.sin(t * 8.3);
    this.flickerLight.position.y = 0.3 + 0.1 * Math.sin(t * 11.1);

    // Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.lifetimes[i] += delta * (0.6 + Math.random() * 0.4);

      if (this.lifetimes[i] >= 1) {
        this.spawn(i);
        continue;
      }

      const life = this.lifetimes[i];
      const drift = Math.sin(this.phases[i] + t * 3) * 0.015;
      this.positions[i * 3]     += (this.velocities[i * 3] + drift) * delta;
      this.positions[i * 3 + 1] += this.velocities[i * 3 + 1] * delta * (1 - life * 0.5);
      this.positions[i * 3 + 2] += this.velocities[i * 3 + 2] * delta;

      // Slow horizontal spread as particle ages
      this.velocities[i * 3]     *= 0.98;
      this.velocities[i * 3 + 2] *= 0.98;
    }

    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }

  addTo(scene: THREE.Scene) {
    scene.add(this.group);
  }

  dispose() {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
    this.sprite.dispose();
  }
}
