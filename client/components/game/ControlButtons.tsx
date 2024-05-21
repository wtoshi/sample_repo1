import React from 'react';
import { Button } from '../ui/button';

const ControlButtons = ({ onDelete, onChange, onEnter }: { onDelete: () => void, onChange: () => void, onEnter: () => void }) => {
    return (
        <div className="flex justify-center space-x-4">
            <Button onClick={onDelete} className="bg-red-500 hover:bg-red-600">
                Delete
            </Button>
            <Button onClick={onChange} className="bg-yellow-500 hover:bg-yellow-600">
                Change
            </Button>
            <Button onClick={onEnter} className="bg-green-500 hover:bg-green-600">
                Enter
            </Button>
        </div>
    );
};

export default ControlButtons;
