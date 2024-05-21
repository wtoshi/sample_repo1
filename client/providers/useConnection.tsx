"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import toast from 'react-hot-toast';

type IConnectionContext = {
    connection: Socket | null;
    isConnected: boolean;
};

const ConnectionContext = createContext({} as IConnectionContext);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connection = io(`${process.env.NEXT_PUBLIC_API_URL}`, { autoConnect: true, transports: ['websocket', 'polling'] });

        setConnection(connection)

        connection.on('connect', () => {
            console.log('connected to server!')
            setIsConnected(true);
        });

        connection.on('disconnect', () => {

            console.log('[Client] - Disconnected!')
         
            toast.error('Connection lost!')    
            setIsConnected(false);
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        });

        return () => {
            connection.disconnect();
        };
    }, [])

    return (
        <ConnectionContext.Provider value={{ connection, isConnected }}>
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => useContext(ConnectionContext);
