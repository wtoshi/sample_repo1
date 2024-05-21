"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

import { useConnection } from './useConnection'
import { Player, Events } from '@/lib/types'
import { useLocale } from "next-intl";
import { clearUserData } from '@/lib/utils/authUtils';
import { useMainContext } from './mainContext';

type IPlayerContext = {
    token: string
    player: Player | null
    setPlayer: (player: Player) => void
    logout: () => void
    inLobby: boolean
    setInLobby: (boolean) => void
    connect: (data: Pick<Player, 'nickname' | 'token' | 'avatar'>) => Promise<void>
}

const PlayerContext = createContext({} as IPlayerContext)
const STORAGE_KEY = '@spellingbee:player'

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<Player | null>(null)
    const [opponentPlayer, setOpponentPlayer] = useState<Player | null>(null)
    const [token, setToken] = useState('')  
    const [inLobby, setInLobby] = useState(false) 

    const context = useMainContext();

    const locale = useLocale();

    const { connection } = useConnection()

    const connectToLobby = useCallback((paramPlayer: Pick<Player, 'nickname' | 'token' | 'avatar'> & { language: string }): Promise<void> => new Promise((resolve, reject) => {
        connection?.emit(Events.ON_PLAYER_JOIN_LOBBY, paramPlayer, (player?: Player, error?: string) => {

            console.log('[Client] - Player joined lobby', player, error)
            if (!player && error) {
                reject(error)
            }

            setInLobby(true)
            setPlayer(player || null)
            setToken(paramPlayer.token)
            resolve()
        })
    }), [connection])

    const handleUserConnect = async ({ nickname, token, avatar }: Pick<Player, 'nickname' | 'token' | 'avatar'>) => {

        const props = { nickname, avatar, token, language: locale};

        await connectToLobby(props)

        setToken(token) 
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ nickname, token, avatar } as Pick<Player, 'nickname' | 'token' | 'avatar'>)
        )
    }

    const disconnectUser = () => {

        if (!player) return

        console.log('[Client] - Player leaving lobby', player)

        connection?.emit(Events.ON_PLAYER_LEAVE_LOBBY, player)

        setInLobby(false)
        setOpponentPlayer(null)
        setPlayer(null)
        setToken('')

        window.localStorage.removeItem(STORAGE_KEY)

        clearUserData();
        context.setSceneState('introScene')
    }

    useEffect(() => {
        const localStorage = window.localStorage.getItem(STORAGE_KEY)

        if (localStorage) {
            const usr = JSON.parse(localStorage) as Pick< Player, 'nickname' | 'token' | 'avatar' >

            if (!usr.nickname || !usr.token) {                  
                window.localStorage.removeItem(STORAGE_KEY)
                return
            }

            connectToLobby({ ...usr, language: locale }) 
        }
    }, [connection, connectToLobby,locale])

    return (
        <PlayerContext.Provider
            value={{
                connect: handleUserConnect,
                logout: disconnectUser,
                inLobby,
                setInLobby,
                player,
                setPlayer,
                token
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext)
