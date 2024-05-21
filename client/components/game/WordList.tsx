import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WordListProps {
    words: { word: string; isCorrect: boolean }[];
    lastwordIndex: number;
}

const WordList: React.FC<WordListProps> = ({ words, lastwordIndex }) => {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (words.length > 0) {

            if(!words[lastwordIndex])
                return;
            
            const timer = setTimeout(() => setHighlightedIndex(null), 1000);

            // Scroll to top or bottom based on the highlighted index
            if (listRef.current) {
                if (words[lastwordIndex].isCorrect) {
                    listRef.current.scrollTop = 0;
                } else {
                    listRef.current.scrollTop = listRef.current.scrollHeight;
                }
            }

            return () => clearTimeout(timer);
        }
    }, [words, lastwordIndex]);

    return (
        <div ref={listRef} className="flex flex-wrap max-h-96 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-500 dark:scrollbar-track-gray-800">

            {words.length > 0 ? words.map((entry, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, backgroundColor: 'rgba(0, 0, 0, 0)' }}
                    animate={{
                        opacity: 1,
                        transition: { duration: 0.5 },
                        backgroundColor: highlightedIndex === index
                            ? entry.isCorrect
                                ? '#ffeeba' // Highlight color for correct word
                                : '#ffcccc' // Highlight color for incorrect word
                            : 'rgba(0, 0, 0, 0)',
                    }}
                    className="flex items-center space-x-2 p-2 rounded-lg"
                >
                    <span className="bg-gray-200 p-2 rounded font-bold flex-shrink-0">{entry.word}</span>
                    {entry.isCorrect ? (
                        <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    ) : (
                        <XCircle className="text-red-500 flex-shrink-0" size={24} />
                    )}
                </motion.div>
            )) : <div className="text-gray-500 text-center w-full">No words yet</div>}
        </div>
    );
};

export default WordList;
