import { truncateText } from "@/lib/utils/utils";
import Image from "next/image";
import React from "react";

type LeaderBoardItemProps = {
    index: number;
    avatar: string;
    nickname: string;
    score: number;
    isCurrentUser: boolean;
};

const LeaderBoardItem = ({ index, avatar, nickname, score, isCurrentUser }: LeaderBoardItemProps) => {
    const maxTextLength = 20;

    const truncatedNickname = truncateText(nickname, maxTextLength);
    const truncatedScore = truncateText(score.toString(), maxTextLength);

    return (
        <div className={`flex items-center w-[250px] h-[50px] rounded-lg justify-between p-3 border ${isCurrentUser ? 'bg-blue-200' : 'bg-white dark:bg-gray-300'}`}>
            <span className="mr-4 text-sm font-bold">#{index + 1}</span>
            <div className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image src={avatar} alt="avatar" width={40} height={40} />
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                    <span className="text-sm font-semibold truncate">{truncatedNickname}</span>
                </div>
            </div>
            <div className="flex flex-col items-end ml-4">
                <span className="text-sm font-semibold">{truncatedScore}</span>
            </div>
        </div>
    );
};

export default LeaderBoardItem;
