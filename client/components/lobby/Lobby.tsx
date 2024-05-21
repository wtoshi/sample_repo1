import { Suspense, useEffect, useState } from "react";
import { useMainContext } from "@/providers/mainContext";
import Spinner from "../shared/skeletons/spinner";
import { motion } from "framer-motion";
import LeaderBoard from "./LeaderBoard";
import LeaderBoardSkeleton from "../shared/skeletons/LeaderBoardSkeleton";
import PlayerStatsSkeleton from "../shared/skeletons/PlayerStatsSkeleton";
import { Button } from "../ui/button";
import { openModal } from "@/lib/utils/modalUtils";
import { useTranslations } from 'next-intl';
import MatchingDialog from "../modals/modal-matching";
import PlayerStats from "./PlayerStats";
import { UserSearch } from "lucide-react";
import { usePlayer } from "@/providers/usePlayer";
import { getUserData } from "@/lib/utils/authUtils";
import { Player } from "@/lib/types";
import { getMyPlayer } from "@/lib/controllers/apiController";
import { useConnection } from "@/providers/useConnection";

export default function Lobby() {

    const t = useTranslations();

    const { isConnected, connection } = useConnection();
    const { connect, logout, player, setPlayer, inLobby } = usePlayer()

    const [playerData, setPlayerData] = useState<Player | null>(null);

    const context = useMainContext();
    const [matching, setMatching] = useState(false);

    const [loading, setLoading] = useState(true);

    const lobbyVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    useEffect(() => {
        if (context.sceneState !== 'lobbyScene') return;

        const fetchPlayer = async () => {
            setLoading(true);
            const myPlayer = getUserData();

            if (myPlayer && myPlayer.nickname) {
                const data = await getMyPlayer(myPlayer.nickname);
                setPlayer(data);
                setPlayerData(data);
            }
            setLoading(false);
        };

        fetchPlayer();

        return () => {
            setPlayer(null);
            setPlayerData(null);
        }

    }, [context.sceneState, setPlayerData, setPlayer]);

    useEffect(() => {
        if (context.sceneState !== 'lobbyScene' || !playerData) return;

        const connectPlayerToLobby = async () => {

            if (!inLobby) {
                await connect(playerData);
                console.log('Connected to Lobby');
            } else {
                console.log('Already connected to Lobby');
            }
        };

        connectPlayerToLobby();

        return () => {
            if (context.sceneState !== 'lobbyScene') {
                logout();
            }
        };
    }, [context.sceneState, playerData, inLobby, connect, logout]);

    useEffect(() => {
        if (matching) {
            openModal(context, 'matchingModal');
        }
    }, [matching]);

    const onCloseMatching = () => {
        setMatching(false);
    }

    return (
        <main className="flex-center h-auto w-full">
            {context.loading ? <Spinner size={10} /> : (
                <motion.div
                    variants={lobbyVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex-center w-full px-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                        <div className="md:col-span-3 pt-4 bg-slate-100 dark:bg-[#0F1E39] rounded-lg shadow-lg border">
                            <Suspense fallback={<PlayerStatsSkeleton />}>
                                <PlayerStats player={player} loadingPlayerData={loading} />
                            </Suspense>

                            {!loading &&
                                <motion.div
                                    initial={{ scale: 1 }}
                                    animate={{ scale: 1.1 }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                                    className='flex justify-center mt-10 md:mt-10'
                                >
                                    <Button
                                        type='button'
                                        size='lg'
                                        onClick={() => setMatching(true)}
                                        className='w-[200px] md:w-[250px] h-[60px] md:h-[75px] bg-blue-500 hover:bg-blue-600 gap-4 text-xl md:text-2xl mb-4 md:mt-24'
                                    >
                                        <UserSearch />
                                        FIND MATCH
                                    </Button>
                                </motion.div>
                            }
                        </div>
                        <div className="max-w-md mx-auto p-6 bg-slate-100 dark:bg-[#0F1E39] rounded-lg shadow-lg">
                            <Suspense fallback={<LeaderBoardSkeleton />}>
                                <LeaderBoard />
                            </Suspense>
                        </div>
                    </div>
                </motion.div>
            )}
            {matching && (<MatchingDialog onClose={() => onCloseMatching()} />)}
        </main>
    );
}
