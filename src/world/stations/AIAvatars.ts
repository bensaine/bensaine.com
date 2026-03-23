import * as THREE from 'three';
import { StationBase } from './StationBase';
import { STATIONS } from '../../data/stations';

export class AIAvatars extends StationBase {
  constructor() {
    super(STATIONS[2], new THREE.OctahedronGeometry(0.7, 0));
  }
}
