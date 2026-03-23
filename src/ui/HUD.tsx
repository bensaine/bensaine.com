import { HoldPrompt } from './HoldPrompt';
import type { StationData } from '../data/stations';

interface Props {
  nearbyStation: StationData | null;
  stationProgress?: number;
}

export function HUD({ nearbyStation, stationProgress = 0 }: Props) {
  if (!nearbyStation) return null;
  return (
    <HoldPrompt
      label={`Explore — ${nearbyStation.title}`}
      accentColor={nearbyStation.colorHex}
      progress={stationProgress}
    />
  );
}
