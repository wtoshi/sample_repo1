import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hexagon from './Hexagon';
import { LetterData } from '@/lib/types';

interface HiveProps {
  letterData: LetterData;
  onLetterClick: (letter: string) => void;
}

const Hive: React.FC<HiveProps> = ({ letterData, onLetterClick }) => {
  const [animateOrder, setAnimateOrder] = useState<number[]>([]);

  useEffect(() => {
    const order = [3, 0, 1, 2, 4, 5, 6]; // Ortadaki ve çevresindeki hexagonların animasyon sırası
    setAnimateOrder(order);
  }, []);

  return (
    <div className="hive w-full flex flex-col items-center">
      <div className="hive-row flex justify-center space-x-2">
        {animateOrder.length > 0 && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(0) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.others[0] || ''} onClick={onLetterClick} />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(1) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.others[1] || ''} onClick={onLetterClick} />
            </motion.div>
          </>
        )}
      </div>
      <div className="hive-row flex justify-center space-x-2 -mt-4">
        {animateOrder.length > 0 && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(2) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.others[2] || ''} onClick={onLetterClick} />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(3) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.middle || ''} onClick={onLetterClick} special />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(4) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.others[3] || ''} onClick={onLetterClick} />
            </motion.div>
          </>
        )}
      </div>
      <div className="hive-row flex justify-center space-x-2 -mt-4">
        {animateOrder.length > 0 && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(5) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.others[4] || ''} onClick={onLetterClick} />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{
                delay: animateOrder.indexOf(6) * 0.2,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <Hexagon letter={letterData.others[5] || ''} onClick={onLetterClick} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Hive;
