import React from 'react';
import { CarGame } from './games/car/CarGame';
import { PlatformerGame } from './games/platformer/PlatformerGame';
import { Game } from './types';

const games: Record<string, (container: HTMLElement) => Game> = {
  car: (container) => new CarGame(container),
  platform: (ctr) => new PlatformerGame(ctr),
};

export const App = () => {
  const gameRef = React.useRef<Game | null>(null);
  const gameContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    console.log('App.start');

    const onBeforeUnload = () => {
      console.log('onBeforeUnload');
      gameRef.current?.destroy();
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    openGame('platform');

    return () => {
      console.log('app exit8');
      gameRef.current?.destroy();
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  const openGame = (g: string) => {
    // console.log('game', g);
    if (gameRef.current) gameRef.current.destroy();

    if (!gameContainerRef.current) return;

    const ctr = games[g];
    if (ctr) gameRef.current = ctr(gameContainerRef.current);
  };
  return (
    <div className="gameSelector">
      <div>
        {Object.keys(games).map((g) => {
          return (
            <button key={g} onClick={() => openGame(g)}>
              {g}
            </button>
          );
        })}
      </div>
      <div className="gameContainer" ref={gameContainerRef} />
    </div>
  );
};
