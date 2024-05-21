import React, { useEffect, useState } from "react";
import LeaderBoardItem from "./LeaderBoardItem";
import { getLeaderBoard } from "../../lib/controllers/apiController";
import { LeaderBoardPlayerItem } from "@/lib/types";
import { getUserData } from "@/lib/utils/authUtils";
import LeaderBoardSkeleton from "../shared/skeletons/LeaderBoardSkeleton";

const LeaderBoard = () => {
    const [players, setPlayers] = useState<LeaderBoardPlayerItem[]>([]);
    const [loading, setLoading] = useState(true);

    const myNickname = getUserData()?.nickname;

    useEffect(() => {
        const fetchLeaderBoard = async () => {
            const data = await getLeaderBoard();
            if (data) {
                setPlayers(data);
            }
            setLoading(false);
        };

        fetchLeaderBoard();
    }, []);

    if (loading) { return <LeaderBoardSkeleton />; }

    return (
        <>
            <h1 className="text-xl text-center font-bold mb-4 checkDarkTheme-Text">Leader Board</h1>
            <div className="space-y-4 max-h-96 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-500 dark:scrollbar-track-gray-800">
                {players.map((player, index) => (
                    <LeaderBoardItem
                        key={index}
                        index={index}
                        avatar={player.avatar}
                        nickname={player.nickname}
                        score={player.score}
                        isCurrentUser={player.nickname === myNickname}
                    />
                ))}
            </div>
        </>
    );
};

export default LeaderBoard;
