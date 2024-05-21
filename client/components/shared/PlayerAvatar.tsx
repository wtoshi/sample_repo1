import Image from 'next/image';
import React from 'react';

type PlayerAvatarProps = {
  username: string;
  avatar: string;
  showCrown: boolean;
};

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ username, avatar, showCrown }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image 
            src={avatar} 
            alt={`${username}'s avatar`} 
            width={96}
            height={96}
            className="rounded-full border-4 border-gray-200" />
        {showCrown && (
          <Image 
          src="/images/crown.svg" 
          alt="Crown" 
          width={42}
          height={42}
          className="absolute -top-8 right-6" />
        )}
      </div>
      <div className="mt-2 text-lg font-bold">{username}</div>
    </div>
  );
};

export default PlayerAvatar;
