"use client"
import { useState, useEffect, Suspense } from 'react';
import { useLocale, useTranslations } from 'next-intl';
// SCENES
import Intro from '@/components/intro/Intro';
import Lobby from '@/components/lobby/Lobby';
import GameRoom from '@/components/game/GameRoom';
// MODALS
import RankingModal from '@/components/modals/modal-ranking';
import PlayModal from '@/components/modals/modal-play';
import HowToPlayModal from '@/components/modals/modal-howToPlay';
// PROVIDERS
import { useMainContext } from '@/providers/mainContext';
// UI
import Loading from './loading';
import { getUserData, isAuth } from '@/lib/utils/authUtils';

export default function Home() {

  const context = useMainContext();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const isAuthSuccess = isAuth();

    if (context.sceneState === 'introScene') {
      if (isAuthSuccess) {
        context.setSceneState('lobbyScene');
      }
    } else {
      if (!isAuthSuccess) {
        context.setSceneState('introScene');
      }
    }

    setCheckedAuth(true);
  }, [context]);

  return (
    <main className="flex flex-col items-center justify-between p-24 wrapper">
      {!checkedAuth && <Loading />}

      <Suspense fallback={<Loading />}>
        {checkedAuth && context.sceneState === 'introScene' && <Intro />}
        {context.sceneState === 'lobbyScene' && <Lobby />}
        {context.sceneState === 'gameScene' && <GameRoom />}
      </Suspense>

      <HowToPlayModal />
      <RankingModal />
      <PlayModal />
    </main>
  );
}
