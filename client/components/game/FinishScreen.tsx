import { Player } from '@/lib/types';
import Link from 'next/link';
import { usePlayer } from '@/providers/usePlayer';
import { useGame } from '@/providers/useGame';
import Confetti from 'react-confetti';
import { FiArrowLeft } from 'react-icons/fi';
import PlayerAvatar from '../shared/PlayerAvatar';
import { Button } from '../ui/button';
import { useMainContext } from '@/providers/mainContext';
import { useEffect, useState } from 'react';

type Props = {
  winnerNick: string | null;
};

export const FinishScreen: React.FC<Props> = ({ winnerNick }) => {
  const { player } = usePlayer();
  const { oppositePlayerInMatch, playerInMatch } = useGame();
  const context = useMainContext();

  const [winnerIsPlayer, setWinnerIsPlayer] = useState(false);

  useEffect(() => {

    if (typeof winnerNick === 'string' && playerInMatch.playerObject) {
      setWinnerIsPlayer(winnerNick === playerInMatch.playerObject.nickname);

    }
  }, [winnerNick, player]);

  return (
    <>
      {winnerIsPlayer && <Confetti />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg mx-auto text-center">
          <div className="flex justify-around items-center mb-8">
            <PlayerAvatar
              username={playerInMatch?.playerObject.nickname || ''}
              avatar={playerInMatch?.playerObject.avatar || '/avatars/avatar1.png'}
              showCrown={winnerIsPlayer}
            />
            <div className="text-3xl font-bold">vs</div>
            <PlayerAvatar
              username={oppositePlayerInMatch?.playerObject.nickname || ''}
              avatar={oppositePlayerInMatch?.playerObject.avatar || '/avatars/avatar1.png'}
              showCrown={winnerNick === oppositePlayerInMatch?.playerObject.nickname}
            />
          </div>
          <div className="text-2xl font-bold mb-4">
            {winnerIsPlayer && 'You Win!'}
            {!winnerIsPlayer && winnerNick && 'You Lose'}
            {!winnerNick && 'It\'s a Tie'}
          </div>
          <div className="mt-8">
            <Button
              variant='outline'
              type='button'
              onClick={() => {
                context.setSceneState('lobbyScene');
              }}
            >
              Lobby
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinishScreen;
