import React from 'react';
import { motion } from 'framer-motion';

interface HexagonProps {
  letter: string;
  onClick: (letter: string) => void;
  special?: boolean;
}

const Hexagon: React.FC<HexagonProps> = ({ letter, onClick, special = false }) => {
  return (
    <motion.div
      className={`hexagon cursor-pointer flex items-center justify-center text-white text-xl font-bold ${special ? 'bg-yellow-500' : 'bg-blue-500'}`}
      onClick={() => onClick(letter)}
      whileTap={{ scale: 0.9 }}
    >
      {letter}
    </motion.div>
  );
};

export default Hexagon;
