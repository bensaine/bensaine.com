import * as THREE from 'three';
import { StationBase } from './StationBase';
import { STATIONS } from '../../data/stations';

export class MLObservability extends StationBase {
  constructor() {
    super(STATIONS[3], new THREE.DodecahedronGeometry(0.7, 0));
  }
}
