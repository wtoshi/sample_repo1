import React from 'react';

interface TextDisplayProps {
    text: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text }) => {
    return (
        <div className="text-display bg-transparent font-bold p-4 rounded shadow dark:shadow-blue-50 text-2xl checkDarkTheme-Text">
            {text}
            <span className="blinking-cursor text-transparent ml-1">|</span>
        </div>
    );
};

export default TextDisplay;
