export interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  eHeld: boolean;
  mouseDeltaX: number;
  mouseDeltaY: number;
}

export class InputManager {
  isLocked = false;
  readonly movement: MovementState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    eHeld: false,
    mouseDeltaX: 0,
    mouseDeltaY: 0,
  };

  private canvas: HTMLElement;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    canvas.addEventListener('click', this.requestLock);
    document.addEventListener('pointerlockchange', this.onLockChange);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  /** Call after consuming deltas each frame to reset them. */
  flushDeltas() {
    this.movement.mouseDeltaX = 0;
    this.movement.mouseDeltaY = 0;
  }

  dispose() {
    this.canvas.removeEventListener('click', this.requestLock);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    if (document.pointerLockElement) document.exitPointerLock();
  }

  private requestLock = () => {
    if (!this.isLocked) this.canvas.requestPointerLock();
  };

  private onLockChange = () => {
    this.isLocked = document.pointerLockElement === this.canvas;
  };

  private onKeyDown = (e: KeyboardEvent) => {
    this.setKey(e.code, true);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.setKey(e.code, false);
  };

  private setKey(code: string, down: boolean) {
    switch (code) {
      case 'KeyW': case 'ArrowUp':    this.movement.forward  = down; break;
      case 'KeyS': case 'ArrowDown':  this.movement.backward = down; break;
      case 'KeyA': case 'ArrowLeft':  this.movement.left     = down; break;
      case 'KeyD': case 'ArrowRight': this.movement.right    = down; break;
      case 'KeyE':                    this.movement.eHeld    = down; break;
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isLocked) return;
    this.movement.mouseDeltaX += e.movementX;
    this.movement.mouseDeltaY += e.movementY;
  };
}
