import * as THREE from 'three';
import { StationBase } from './StationBase';
import { STATIONS } from '../../data/stations';

export class SpeechAnalytics extends StationBase {
  constructor() {
    super(STATIONS[4], new THREE.IcosahedronGeometry(0.7, 0));
  }
}
