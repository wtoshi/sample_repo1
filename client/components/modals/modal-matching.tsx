import { shouldOpenModal, closeModal } from '@/lib/utils/modalUtils';
import { useMainContext } from '@/providers/mainContext';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../ui/button';
import { usePlayer } from '@/providers/usePlayer';
import { useConnection } from '@/providers/useConnection';
import { Events, Player } from '@/lib/types';
import { useGame } from '@/providers/useGame';

interface MatchingDialogProps {
  onClose: () => void; // Kapama butonu için fonksiyon
}

const MatchingDialog: React.FC<MatchingDialogProps> = ({ onClose }) => {
  const t = useTranslations();
  const context = useMainContext();
  const { player, logout } = usePlayer();
  const { connection } = useConnection();

  const { matchFound, setMatchFound, oppositePlayerInMatch } = useGame();

  const [loading, setLoading] = useState(true);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);



  useEffect(() => {

    const handleSearch = () => {
      connection?.emit(
        Events.ON_PLAYER_SEARCH_MATCH,
        { nickname: player?.nickname, action: 'enter' },
        (error: string) => {
          if (error) {
            alert(error);
            return;
          }
        }
      );
    };

    setMatchFound(false);
    handleSearch();
  }, [setMatchFound, connection, player?.nickname]);



  useEffect(() => {
    setOpponentAvatar(oppositePlayerInMatch?.playerObject.avatar || null);

    if (oppositePlayerInMatch) {
      setLoading(false);
    }

  }, [oppositePlayerInMatch]);

  const onCloseModal = () => {
    handleCancelSearch();
    closeModal(context, 'matchingModal');
    onClose();
  };

  const handleCancelSearch = () => {
    connection?.emit(
      Events.ON_PLAYER_SEARCH_MATCH,
      { nickname: player?.nickname, action: 'leave' },
      (error: string) => {
        if (error) {
          alert(error);
          return;
        }
      }
    );
    //handleUserLeave();
  };

  const handleUserLeave = () => {
    logout();
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 flex flex-col items-center w-96">
        <Button
          type='button'
          variant='link'
          onClick={onCloseModal}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-6 h-6 font-semibold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex flex-col items-center">
            <div className="rounded-full overflow-hidden w-24 h-24 mb-2">
              {player?.avatar ? (
                <Image src={player.avatar} alt="Player Avatar" width={96} height={96} className="object-cover" />
              ) : (
                <div className="w-24 h-24 bg-gray-300" />
              )}
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">You</span>
          </div>
          <span className="text-4xl font-bold text-gray-900 dark:text-white">VS</span>
          <div className="flex flex-col items-center">
            {loading ? (
              <div className="w-24 h-24 mb-2 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <div className="rounded-full overflow-hidden w-24 h-24 mb-2">
                {opponentAvatar ? (
                  <Image src={opponentAvatar} alt="Opponent Avatar" width={96} height={96} className="object-cover" />
                ) : (
                  <div className="w-24 h-24 bg-gray-300" />
                )}
              </div>
            )}
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              {loading ? 'Searching...' : oppositePlayerInMatch?.playerObject.nickname || 'Opponent'}
            </span>
          </div>
        </div>
        {matchFound && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{duration:0.5, repeat:Infinity, repeatType:'reverse' }}
          >
            <span className="text-green-500 text-base font-bold">Loading Game...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MatchingDialog;