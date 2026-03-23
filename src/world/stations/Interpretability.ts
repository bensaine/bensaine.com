import * as THREE from 'three';
import { StationBase } from './StationBase';
import { STATIONS } from '../../data/stations';

export class Interpretability extends StationBase {
  constructor() {
    super(STATIONS[0], new THREE.IcosahedronGeometry(0.7, 1));
  }
}
