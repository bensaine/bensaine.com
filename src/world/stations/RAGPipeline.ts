import * as THREE from 'three';
import { StationBase } from './StationBase';
import { STATIONS } from '../../data/stations';

export class RAGPipeline extends StationBase {
  constructor() {
    super(STATIONS[1], new THREE.TorusKnotGeometry(0.5, 0.18, 64, 8));
  }
}
