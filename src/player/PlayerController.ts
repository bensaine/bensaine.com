import * as THREE from 'three';
import type { InputManager } from '../core/InputManager';

const WALK_SPEED = 4; // units/sec
const MOUSE_SENSITIVITY = 0.002;
const HEAD_BOB_FREQ = 2.2; // Hz
const HEAD_BOB_AMP = 0.04;
const PITCH_LIMIT = (85 * Math.PI) / 180;
const SIT_HEIGHT = 0.5;
const STAND_HEIGHT = 1.7;
const RISE_SPEED = 1.2; // units/sec
const SPAWN_PITCH = 0.40;

export class PlayerController {
  private camera: THREE.Camera;
  private input: InputManager;

  private yaw = 0;
  private pitch = SPAWN_PITCH;
  private bobTime = 0;
  private reducedMotion: boolean;

  isSitting = true;
  canStandUp = true;  // set externally; false during cooldown after sitting
  canSitDown = false; // set externally when near spawn and cooldown elapsed
  riseProgress = 0;  // 0 = fully sitting, 1 = fully standing
  sitProgress = 0;   // 0 = standing, 1 = fully sat (only active while sitting back down)
  private isSittingDown = false;
  private sitStartYaw = 0;
  private sitStartPitch = SPAWN_PITCH;
  private eyeHeight = SIT_HEIGHT;

  constructor(camera: THREE.Camera, input: InputManager) {
    this.camera = camera;
    this.input = input;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.position.y = SIT_HEIGHT;
  }

  update(delta: number) {
    const { movement } = this.input;

    // --- Mouse look ---
    this.yaw   -= movement.mouseDeltaX * MOUSE_SENSITIVITY;
    this.pitch -= movement.mouseDeltaY * MOUSE_SENSITIVITY;
    this.pitch  = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, this.pitch));
    if (this.isSitting) this.yaw = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.yaw));
    this.input.flushDeltas();

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;

    // --- Stand up ---
    if (this.isSitting) {
      if (movement.eHeld && this.canStandUp) {
        this.eyeHeight = Math.min(STAND_HEIGHT, this.eyeHeight + RISE_SPEED * delta);
      } else {
        this.eyeHeight = Math.max(SIT_HEIGHT, this.eyeHeight - RISE_SPEED * delta);
      }
      this.riseProgress = (this.eyeHeight - SIT_HEIGHT) / (STAND_HEIGHT - SIT_HEIGHT);
      if (this.eyeHeight >= STAND_HEIGHT) this.isSitting = false;
      this.camera.position.y = this.eyeHeight;
      return;
    }

    // --- Sit back down ---
    if (movement.eHeld && this.canSitDown) {
      if (!this.isSittingDown) {
        this.isSittingDown = true;
        this.eyeHeight = STAND_HEIGHT;
        // Normalize to [-π, π] so interpolation takes the shortest arc to 0
        this.sitStartYaw = ((this.yaw % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        this.yaw = this.sitStartYaw;
        this.sitStartPitch = this.pitch;
      }
      this.eyeHeight = Math.max(SIT_HEIGHT, this.eyeHeight - RISE_SPEED * delta);
      this.sitProgress = (STAND_HEIGHT - this.eyeHeight) / (STAND_HEIGHT - SIT_HEIGHT);
      // Linearly return yaw/pitch to spawn orientation as player sits
      this.yaw   = this.sitStartYaw   * (1 - this.sitProgress);
      this.pitch = this.sitStartPitch * (1 - this.sitProgress) + SPAWN_PITCH * this.sitProgress;
      this.camera.rotation.y = this.yaw;
      this.camera.rotation.x = this.pitch;
      this.camera.position.y = this.eyeHeight;
      if (this.eyeHeight <= SIT_HEIGHT) {
        this.isSittingDown = false;
        this.sitProgress = 0;
        this.yaw = 0;
        this.pitch = SPAWN_PITCH;
        this.isSitting = true;
      }
      return;
    } else if (this.isSittingDown) {
      this.isSittingDown = false;
      this.sitProgress = 0;
      this.eyeHeight = STAND_HEIGHT;
      this.camera.position.y = STAND_HEIGHT;
    }

    // --- Movement ---
    const speed = WALK_SPEED * delta;
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right   = new THREE.Vector3( Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    if (movement.forward)  this.camera.position.addScaledVector(forward,  speed);
    if (movement.backward) this.camera.position.addScaledVector(forward, -speed);
    if (movement.left)     this.camera.position.addScaledVector(right,   -speed);
    if (movement.right)    this.camera.position.addScaledVector(right,    speed);

    // --- Head bob ---
    const isMoving = movement.forward || movement.backward || movement.left || movement.right;
    if (isMoving && !this.reducedMotion) {
      this.bobTime += delta;
      this.camera.position.y = STAND_HEIGHT + Math.sin(this.bobTime * HEAD_BOB_FREQ * Math.PI * 2) * HEAD_BOB_AMP;
    } else {
      if (!isMoving) this.bobTime = 0;
      this.camera.position.y = STAND_HEIGHT;
    }
  }
}
