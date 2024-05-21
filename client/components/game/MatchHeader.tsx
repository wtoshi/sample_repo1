import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { calculatePercentages } from '@/lib/utils/utils';
import { Timer, Trophy } from 'lucide-react';

export type MatchHeaderProps = {
    playerAvatar: string;
    opponentAvatar: string;
    playerScore: number;
    opponentScore: number;
    playerTimeLeft: number;
    opponentTimeLeft: number;
    playerTimeBonus: number | null;
    opponentTimeBonus: number | null;
    playerScoreBonus: number | null;
    opponentScoreBonus: number | null;
};

const MatchHeader = (matchParams: MatchHeaderProps) => {
    const { playerPercentage, opponentPercentage } = calculatePercentages(
        matchParams.playerScore,
        matchParams.opponentScore
    );

    return (
        <div className="flex flex-col sm:flex-row items-center w-full sm:w-[90%]">
            <div className="flex flex-col justify-center items-center mb-4 sm:mb-0">
                <Image
                    src={matchParams.playerAvatar}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-gray-200"
                />

                <div className="relative flex gap-1 mt-1">
                    <Timer />
                    <motion.span
                        initial={{ scale: 1 }}
                        animate={{ scale: matchParams.playerTimeLeft > 60 ? 1.2 : 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-bold text-gray-700"
                    >
                         {matchParams.playerTimeLeft}
                    </motion.span>
                    {matchParams.playerTimeBonus && (
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-full text-green-500 text-sm font-bold"
                        >
                            +{matchParams.playerTimeBonus}
                        </motion.span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full sm:w-[60%] relative">
                <div className="flex justify-between px-4">
                    <span className="flex font-bold text-blue-500 mr-2 relative">
                        <Trophy className="w-6" /> {matchParams.playerScore}
                        <AnimatePresence>
                            {matchParams.playerScoreBonus && (
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute -top-6 left-6 text-green-500 text-sm font-bold"
                                >
                                    +{matchParams.playerScoreBonus}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </span>
                    <span className="flex font-bold text-red-500 ml-2 relative">
                        <Trophy /> {matchParams.opponentScore}
                        <AnimatePresence>
                            {matchParams.opponentScoreBonus && (
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute -top-6 left-6 text-green-500 text-sm font-bold"
                                >
                                    +{matchParams.opponentScoreBonus}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </span>
                </div>

                <div className="relative flex items-center w-full h-4">
                    <div className="relative flex-1 h-full bg-gray-300 rounded-full overflow-hidden">
                        <div
                            className="absolute h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${playerPercentage}%` }}
                        ></div>
                        <div
                            className="absolute h-full bg-red-500 right-0 transition-all duration-500"
                            style={{ width: `${opponentPercentage}%` }}
                        ></div>
                        <div
                            className="absolute h-full w-1 bg-white left-1/2 transform -translate-x-1/2 transition-all duration-500"
                            style={{ left: `${50 + (playerPercentage - 50)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center mt-4 sm:mt-0">
                <Image
                    src={matchParams.opponentAvatar}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-gray-200"
                />
                <div className="relative flex gap-1 mt-1 ">
                    <Timer />
                    <motion.span
                        initial={{ scale: 1 }}
                        animate={{ scale: matchParams.opponentTimeLeft > 60 ? 1.2 : 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-bold text-gray-700"
                    >
                        {matchParams.opponentTimeLeft}
                    </motion.span>
                    {matchParams.opponentTimeBonus && (
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-full text-green-500 text-sm font-bold"
                        >
                            +{matchParams.opponentTimeBonus}
                        </motion.span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchHeader;
