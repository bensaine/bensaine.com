import * as THREE from 'three';

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  private animFrameId = 0;
  private lastTime = 0;
  private updateCallback: ((delta: number) => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x3a1c08, 0.012);
    this.scene.background = new THREE.Color(0x1a0e04);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    // Spawn in the shadow cove, facing the wall (-Z)
    this.camera.position.set(0, 1.7, -32);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = 0; // face -Z (toward the wall)

    window.addEventListener('resize', this.onResize);
  }

  onUpdate(cb: (delta: number) => void) {
    this.updateCallback = cb;
  }

  start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    cancelAnimationFrame(this.animFrameId);
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }

  private loop = (time: number) => {
    this.animFrameId = requestAnimationFrame(this.loop);
    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    this.updateCallback?.(delta);
    this.renderer.render(this.scene, this.camera);
  };

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}
