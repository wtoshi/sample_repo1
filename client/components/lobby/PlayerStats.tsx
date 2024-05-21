import Image from 'next/image'
import React from 'react'
import { Player } from '@/lib/types'
import PlayerStatsSkeleton from '../shared/skeletons/PlayerStatsSkeleton'

const PlayerStats = ({ player, loadingPlayerData }: { player: Player | null, loadingPlayerData: boolean }) => {

    if (loadingPlayerData) {
        return <PlayerStatsSkeleton />;
    }

    if (!player) {
        return null;
    }

    return (
        <>
            <div className='flex flex-col md:flex-row h-auto md:h-40 w-full gap-8 justify-between px-8 '>
                <div className="flex items-center mb-4 sm: justify-center w-full ">
                    <div className="rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                            src={player?.avatar || '/avatars/avatar1.png'}
                            alt="avatar"
                            width={128}
                            height={128}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold checkDarkTheme-Text">{player.nickname}</h1>
                        <p className="text-base text-gray-500">{player.rank}</p>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4 md:flex sm:flex-row md:gap-4 h-40 py-10 justify-center'>
                    <div className='flex flex-col items-center'>
                        <span className="text-4xl font-medium text-slate-800 dark:text-slate-300">{player.gamePlayed}</span>
                        <span className="text-base md:text-lg font-semibold text-orange-300">MATCHES</span>
                    </div>
                    <div className='flex flex-col items-center'>
                        <span className="text-4xl font-medium text-slate-800 dark:text-slate-300">{player.gameWon}</span>
                        <span className="text-base md:text-lg font-semibold text-orange-300">WON</span>
                    </div>
                    <div className='flex flex-col items-center'>
                        <span className="text-4xl font-medium text-slate-800 dark:text-slate-300">{player.gameLost}</span>
                        <span className="text-base md:text-lg font-semibold text-orange-300">LOST</span>
                    </div>
                    <div className='flex flex-col items-center'>
                        <span className="text-4xl font-medium text-slate-800 dark:text-slate-300">{player.score}</span>
                        <span className="text-base md:text-lg font-semibold text-orange-300">SCORE</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayerStats;
