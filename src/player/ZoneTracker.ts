import * as THREE from 'three';
import type { StationBase } from '../world/stations/StationBase';

const PROXIMITY_THRESHOLD = 4;

export class ZoneTracker {
  nearbyStation: StationBase | null = null;

  update(cameraPos: THREE.Vector3, stations: StationBase[]) {
    let closest: StationBase | null = null;
    let closestDist = Infinity;

    for (const station of stations) {
      const dist = cameraPos.distanceTo(station.group.position);
      if (dist < PROXIMITY_THRESHOLD && dist < closestDist) {
        closest = station;
        closestDist = dist;
      }
    }

    // Update isNearby flags
    for (const station of stations) {
      station.isNearby = station === closest;
    }

    this.nearbyStation = closest;
  }
}
