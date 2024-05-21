import React, { useEffect, useState } from 'react';
import Hive from './Hive';
import TextDisplay from './TextDisplay';
import ControlButtons from './ControlButtons';
import WordList from './WordList';
import MatchHeader from './MatchHeader';
import { useGame } from '@/providers/useGame';
import { useMainContext } from '@/providers/mainContext';
import { isAuth } from '@/lib/utils/authUtils';
import { motion } from 'framer-motion';
import { GameStatus, LetterData } from '@/lib/types';
import toast from 'react-hot-toast';
import FinishScreen from './FinishScreen';

const GameRoom: React.FC = () => {
  const context = useMainContext();
  const { game, timer, playerInMatch, oppositePlayerInMatch, finishedPayload, sendWord, sendChangeRequest, wordResult, setwordResult, currentLetter, playerTimedOut, opponentTimedOut, canPlay, setCurrentLetter } = useGame();

  const [text, setText] = useState('');
  const [words, setWords] = useState<{ word: string; isCorrect: boolean }[]>([]);
  const [lastwordIndex, setLastwordIndex] = useState(0);

  const [countdown, setCountdown] = useState(3);
  const [showStartText, setShowStartText] = useState(false);

  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerTimeLeft, setPlayerTimeLeft] = useState(0);
  const [opponentTimeLeft, setOpponentTimeLeft] = useState(0);
  const [playerTimeBonus, setPlayerTimeBonus] = useState<number | null>(null);
  const [opponentTimeBonus, setOpponentTimeBonus] = useState<number | null>(null);
  const [playerScoreBonus, setPlayerScoreBonus] = useState<number | null>(null);
  const [opponentScoreBonus, setOpponentScoreBonus] = useState<number | null>(null);

  // Letter bilgileri
  useEffect(() => {
    if (!game || !playerInMatch) return;

    const thisLetter = playerInMatch.letters[playerInMatch.letters.length - 1];
    setCurrentLetter(thisLetter);

    return () => setCurrentLetter(null);
  }, [game, playerInMatch, setCurrentLetter]);

  // Oyun durumunu
  useEffect(() => {
    if (!game || !playerInMatch) {
      const authOk = isAuth();
      context.setSceneState(authOk ? 'lobbyScene' : 'introScene');
    }
  }, [game, context, playerInMatch]);

  // Oyuncu skorları ve bonusları
  useEffect(() => {
    if (playerInMatch && oppositePlayerInMatch) {
      if (playerScore !== playerInMatch.scoreInMatch) {
        setPlayerScoreBonus(playerInMatch.scoreInMatch - playerScore);
        setTimeout(() => setPlayerScoreBonus(null), 2000);
      }
      if (opponentScore !== oppositePlayerInMatch.scoreInMatch) {
        setOpponentScoreBonus(oppositePlayerInMatch.scoreInMatch - opponentScore);
        setTimeout(() => setOpponentScoreBonus(null), 2000);
      }
      setPlayerScore(playerInMatch.scoreInMatch);
      setOpponentScore(oppositePlayerInMatch.scoreInMatch);
    }
  }, [playerInMatch, oppositePlayerInMatch]);

  // Zamanlayıcıyı
  useEffect(() => {
    if (!timer) return;

    const myTimer = timer.find((x) => x.nickname === playerInMatch?.playerObject.nickname)?.duration;
    const opponentTimer = timer.find((x) => x.nickname !== playerInMatch?.playerObject.nickname)?.duration;

    setPlayerTimeLeft(myTimer!);
    setOpponentTimeLeft(opponentTimer!);
  }, [timer, playerInMatch]);

  // Geri sayım ve başlangıç metni
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowStartText(true);
      const startTimer = setTimeout(() => setShowStartText(false), 1000);
      return () => clearTimeout(startTimer);
    }
  }, [countdown]);

  // Harf tıklama işlemleri
  const handleLetterClick = (letter: string) => {
    if (!canPlay) return;

    setText((prev) => prev + letter);
  };

  const handleDelete = () => {
    if (!canPlay) return;

    setText((prev) => prev.slice(0, -1));
  };

  const handleChange = () => {
    if (!canPlay) return;

    sendChangeRequest();
  };

  const handleEnter = () => {
    if (!canPlay) return;

    if (text.length === 0) return;

    if (!text.includes(playerInMatch.letters[playerInMatch.letters.length - 1].middle)) {
      toast.error('Kelime orta harf içermelidir.');
      setText('');
      return;
    }
    sendWord(text);

    setText('');
  };

  const handleWordResponse = (word: string, index: number, isCorrect: boolean) => {
    setLastwordIndex(index);
    setWords((prevWords) => (isCorrect ? [{ word, isCorrect }, ...prevWords] : [...prevWords, { word, isCorrect }]));

    setwordResult({ word: '', nickname: '', index: 0, isCorrect: false });
  };

  useEffect(() => {
    if (!game || !game.players || !playerInMatch) return;

    const myTimeBonus = game.players.find((x) => x.playerObject.nickname === playerInMatch?.playerObject.nickname)?.hasTimerBonus;
    const opponentTimeBonus = game.players.find((x) => x.playerObject.nickname !== playerInMatch?.playerObject.nickname)?.hasTimerBonus;

    if (myTimeBonus > 0) {
      setPlayerTimeBonus(myTimeBonus);
      setTimeout(() => setPlayerTimeBonus(null), 2000);
    }

    if (opponentTimeBonus > 0) {
      setOpponentTimeBonus(opponentTimeBonus);
      setTimeout(() => setOpponentTimeBonus(null), 2000);
    }

    if (wordResult.nickname !== playerInMatch?.playerObject.nickname) return;

    handleWordResponse(wordResult.word, wordResult.index, wordResult.isCorrect);

  }, [wordResult, playerInMatch, game]);

  return (
    <div className="relative w-full h-full px-4 sm:px-8 md:px-16 lg:px-24">
      {game?.status === GameStatus.FINISHED && finishedPayload && (
        <FinishScreen winnerNick={finishedPayload.winner?.nickname || null} />
      )}
      {countdown > 0 || showStartText ? (
        <div className="absolute inset-0 z-50 flex justify-center items-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: showStartText ? 1.5 : 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-orange-700"
          >
            {countdown > 0 ? countdown : 'Start'}
          </motion.div>
        </div>
      ) : null}

      {playerTimedOut && (
        <div className="absolute inset-0 z-50 flex justify-center items-center bg-transparent">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-4xl font-bold text-white"
          >
            Waiting for opponent...
          </motion.div>
        </div>
      )}

      <div className="flex flex-col justify-center items-center space-y-4">
        <MatchHeader
          playerAvatar={playerInMatch?.playerObject.avatar || '/avatars/avatar1.png'}
          opponentAvatar={oppositePlayerInMatch?.playerObject.avatar || '/avatars/avatar1.png'}
          playerScore={playerScore}
          opponentScore={opponentScore}
          playerTimeLeft={playerTimeLeft}
          opponentTimeLeft={opponentTimeLeft}
          playerTimeBonus={playerTimeBonus}
          opponentTimeBonus={opponentTimeBonus}
          playerScoreBonus={playerScoreBonus}
          opponentScoreBonus={opponentScoreBonus}
        />
      </div>

      <div className="w-full flex justify-center mt-4">
        <TextDisplay text={text} />
      </div>
      <div className="flex flex-col md:flex-row justify-center bg-transparent mt-12 pr-8">
        <div className="flex flex-col items-center justify-center w-full md:w-[500px] space-y-6">
          <Hive letterData={currentLetter || { middle: '', others: [] }} onLetterClick={handleLetterClick} />
          <ControlButtons onDelete={handleDelete} onChange={handleChange} onEnter={handleEnter} />
        </div>
        <div className="w-full md:w-[400px] mt-6 md:mt-0">
          <WordList words={words} lastwordIndex={lastwordIndex} />
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
