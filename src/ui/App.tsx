import { useEffect, useRef, useState } from 'react';
import { Engine } from '../core/Engine';
import { InputManager } from '../core/InputManager';
import { Cave } from '../world/Cave';
import { Fire } from '../world/Fire';
import { Shadows } from '../world/Shadows';
import { Interpretability } from '../world/stations/Interpretability';
import { RAGPipeline } from '../world/stations/RAGPipeline';
import { AIAvatars } from '../world/stations/AIAvatars';
import { MLObservability } from '../world/stations/MLObservability';
import { SpeechAnalytics } from '../world/stations/SpeechAnalytics';
import type { StationBase } from '../world/stations/StationBase';
import { PlayerController } from '../player/PlayerController';
import { ZoneTracker } from '../player/ZoneTracker';
import { StartScreen } from './StartScreen';
import { HUD } from './HUD';
import { HoldPrompt } from './HoldPrompt';
import type { StationData } from '../data/stations';

const PROMPT_COOLDOWN = 2; // seconds before showing next sit/stand prompt

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [locked, setLocked] = useState(false);
  const [nearbyStation, setNearbyStation] = useState<StationData | null>(null);
  const [sitting, setSitting] = useState(true);
  const [riseProgress, setRiseProgress] = useState(0);
  const [sitProgress, setSitProgress] = useState(0);
  const [nearSpawn, setNearSpawn] = useState(false);
  const [promptReady, setPromptReady] = useState(true);

  // Refs for cooldown logic inside the game loop (avoids setState-in-effect)
  const prevSittingRef = useRef(true);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptReadyRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current!;

    const engine = new Engine(canvas);
    const input = new InputManager(canvas);
    const cave = new Cave();
    const fire = new Fire();
    const shadows = new Shadows();

    const stations: StationBase[] = [
      new Interpretability(),
      new RAGPipeline(),
      new AIAvatars(),
      new MLObservability(),
      new SpeechAnalytics(),
    ];

    const player = new PlayerController(engine.camera, input);
    const zoneTracker = new ZoneTracker();

    cave.addTo(engine.scene);
    fire.addTo(engine.scene);
    shadows.addTo(engine.scene);
    stations.forEach((s) => s.addTo(engine.scene));

    engine.onUpdate((delta) => {
      if (input.isLocked) player.update(delta);
      fire.update(delta);
      shadows.update(delta);
      zoneTracker.update(engine.camera.position, stations);
      stations.forEach((s) => s.update(delta));

      const p = engine.camera.position;
      const isNearSpawn = Math.hypot(p.x, p.z + 32) < 3;

      // Detect sit/stand transition → start cooldown
      if (prevSittingRef.current !== player.isSitting) {
        prevSittingRef.current = player.isSitting;
        if (cooldownRef.current) clearTimeout(cooldownRef.current);
        promptReadyRef.current = false;
        setPromptReady(false);
        cooldownRef.current = setTimeout(() => {
          promptReadyRef.current = true;
          setPromptReady(true);
        }, PROMPT_COOLDOWN * 1000);
      }

      // Stand/sit only allowed when the prompt is visible
      player.canStandUp = promptReadyRef.current;
      player.canSitDown = isNearSpawn && promptReadyRef.current;

      setNearbyStation(zoneTracker.nearbyStation?.data ?? null);
      setSitting(player.isSitting);
      setRiseProgress(player.riseProgress);
      setSitProgress(player.sitProgress);
      setNearSpawn(isNearSpawn);
    });

    // Handle "E" to activate nearby station
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && zoneTracker.nearbyStation) {
        // Phase 3: open station panel
        console.log('activate', zoneTracker.nearbyStation.data.title);
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const onLockChange = () => setLocked(document.pointerLockElement === canvas);
    document.addEventListener('pointerlockchange', onLockChange);

    engine.start();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerlockchange', onLockChange);
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      engine.dispose();
      input.dispose();
      cave.dispose();
      fire.dispose();
      shadows.dispose();
      stations.forEach((s) => s.dispose());
    };
  }, []);

  const handleEnter = () => {
    canvasRef.current?.requestPointerLock();
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />
      {locked && <HUD nearbyStation={sitting ? null : nearbyStation} />}
      {locked && sitting && promptReady && <HoldPrompt label="Hold to stand" progress={riseProgress} />}
      {locked && !sitting && nearSpawn && promptReady && <HoldPrompt label="Hold to sit" progress={sitProgress} />}
      {!locked && <StartScreen onEnter={handleEnter} />}
    </>
  );
}
