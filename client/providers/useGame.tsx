"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useConnection } from './useConnection'
import toast from 'react-hot-toast';
import { usePlayer } from './usePlayer'
import Spinner from '@/components/shared/skeletons/spinner'
import { Events, GameEvents, Game, GameFinishPayload, PlayerData, TimerData, LetterData } from '@/lib/types';
import { useMainContext } from './mainContext';

type IGameContext = {
    game: Game | null
    timer: TimerData | null
    playerInMatch: PlayerData | null
    oppositePlayerInMatch: PlayerData | null
    canPlay: boolean
    sendWord: (word: string) => void
    sendChangeRequest: () => void
    currentLetter: LetterData | undefined
    setCurrentLetter: (value: LetterData) => void
    wordResult: { word: string, nickname: string, index: number, isCorrect: boolean }
    setwordResult: (value: { word: string, nickname: string, index: number, isCorrect: boolean }) => void
    matchFound: boolean
    setMatchFound: (value: boolean) => void
    finishedPayload: GameFinishPayload | null
    playerTimedOut: boolean
    opponentTimedOut: boolean
}

const GameContext = createContext({} as IGameContext)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const context = useMainContext();
    const [game, setGame] = useState<Game | null>(null)
    const [wordResult, setWordResult] = useState<{ word: string, nickname: string, index: number, isCorrect: boolean }>({ word: '', nickname: '', index: 0, isCorrect: false })
    const [timer, setTimer] = useState<TimerData | null>(null)
    const [matchFound, setMatchFound] = useState(false)
    const [finishedPayload, setFinishedPayload] = useState<GameFinishPayload | null>(null)
    const [canPlay, setCanPlay] = useState(false)
    const [playerInMatch, setPlayerInMatch] = useState<PlayerData>(null);
    const [oppositePlayerInMatch, setOppositePlayerInMatch] = useState<PlayerData>(null);
    const { connection, isConnected } = useConnection()
    const { player, token } = usePlayer()
    const [playerTimedOut, setPlayerTimedOut] = useState(false);
    const [opponentTimedOut, setOpponentTimedOut] = useState(false);
    const [currentLetter, setCurrentLetter] = useState<LetterData | null>();

    const sendWord = (word: string) => {
        connection?.emit(Events.ON_PLAYER_SEND_WORD, { nickname: playerInMatch?.playerObject.nickname, token, word },
            (error: string) => {
                if (error) {
                    toast.error(error)
                }
            }
        )
    }

    const sendChangeRequest = () => {
        connection?.emit(Events.ON_PLAYER_SEND_CHANGE, { nickname: playerInMatch?.playerObject.nickname, token },
            (error: string) => {
                if (error) {
                    toast.error(error)
                }
            }
        )
    }

    const doSetGame = (game: Game) => {

        if (!game || !game.players) return;

        setGame(game)

        const connectionId = String(connection?.id).trim();
        const self = game.players.find(p => String(p.playerObject.id).trim() === connectionId);
        const opponent = game.players.find(p => String(p.playerObject.id).trim() !== connectionId);
        //console.log('connectionId',connectionId,'self',self,'opponent',opponent)

        if (!self || !opponent) return;

        setPlayerInMatch(self);
        setOppositePlayerInMatch(opponent);
    }

    // Debugging useEffect for playerInMatch state
    useEffect(() => {
        console.log('Updated playerInMatch:', playerInMatch);
    }, [playerInMatch]);

    useEffect(() => {
        /** Game events handler */
        if (!isConnected) return

        const handleMatchFind = (game: Game) => {

            // Clear previus state
            setFinishedPayload(null)

            doSetGame(game)
            const self = game.players.find(p => p.playerObject.id === connection?.id);
            const opponent = game.players.find(p => p.playerObject.id !== connection?.id);

            setCurrentLetter(self?.letters[self?.letters.length - 1] || null)

            setMatchFound(true)

            setTimeout(() => {
                context.setSceneState('gameScene');
            }, 3000);
        };

        const handleGameStart = (game: Game) => {

            console.log("GAME START", game)

            doSetGame(game)

            setCanPlay(true)

        };

        const handleSendTimers = (timerData: TimerData) => {
            setTimer(timerData);
        };

        const handleSendWordResult = (response: any) => {
            const { game, nickname, word, index, isCorrect } = response

            doSetGame(game)

            setWordResult({ nickname, word, index, isCorrect })
        };

        const handleChangeResult = (response: any) => {

            const { game } = response

            if (!game || !game.players) return;

            const self = game.players.find(p => p.playerObject.id === connection?.id);
            setGame(game);

            if (!self) return;
            setPlayerInMatch(self);

            let newLetter = self.letters[self.letters.length - 1];
            if (!newLetter) return;

            setCurrentLetter(newLetter);
        };

        const handlePlayerTimeout = (res: any) => {

            console.log('TIME OUT RES: ', res)

            const { game, nickname } = res

            doSetGame(game)

            console.log('playerInMatch', playerInMatch)

            if (nickname === playerInMatch?.playerObject.nickname) {

                console.log('TIME OUT!! ')
                setCanPlay(false)
                toast('TIME OUT!')
                setPlayerTimedOut(true);
            } else {
                setOpponentTimedOut(true);
            }
        };

        const handleGameFinish = (payload: GameFinishPayload) => {

            console.log('GAME FINISH', payload)
            doSetGame(payload.game)

            setCanPlay(false)
            setPlayerTimedOut(false);
            setFinishedPayload(payload)
        };

        connection!.on(GameEvents.ON_MATCH_FIND, handleMatchFind);
        connection!.on(GameEvents.ON_GAME_START, handleGameStart);
        connection!.on(GameEvents.ON_SEND_TIMERS, handleSendTimers);
        connection!.on(GameEvents.ON_PLAYER_TIMEOUT, handlePlayerTimeout);
        connection!.on(GameEvents.ON_GAME_FINISH, handleGameFinish);
        connection!.on(GameEvents.ON_SEND_WORD_RESULT, handleSendWordResult);
        connection!.on(GameEvents.ON_SEND_CHANGE_RESULT, handleChangeResult);

        return () => {
            connection!.off(GameEvents.ON_MATCH_FIND, handleMatchFind);
            connection!.off(GameEvents.ON_GAME_START, handleGameStart);
            connection!.off(GameEvents.ON_SEND_TIMERS, handleSendTimers);
            connection!.off(GameEvents.ON_PLAYER_TIMEOUT, handlePlayerTimeout);
            connection!.off(GameEvents.ON_GAME_FINISH, handleGameFinish);
            connection!.off(GameEvents.ON_SEND_WORD_RESULT, handleSendWordResult);
            connection!.off(GameEvents.ON_SEND_CHANGE_RESULT, handleChangeResult);
            connection!.off('disconnect');
        };
    }, [connection, isConnected, playerInMatch])

    // useEffect(() => {

    //     if (!game || !game.players) return;

    //     doSetGame(game)

    // }, [game, connection?.id]);

    return (
        <GameContext.Provider
            value={{
                game,
                timer,
                playerInMatch,
                oppositePlayerInMatch,
                canPlay,
                sendWord,
                sendChangeRequest,
                currentLetter,
                setCurrentLetter,
                wordResult,
                setwordResult: setWordResult,
                matchFound,
                setMatchFound,
                finishedPayload,
                playerTimedOut,
                opponentTimedOut
            }}
        >
            {!connection || !connection?.active ? (
                <div>
                    <Spinner size={15} />
                </div>
            ) : (
                children
            )}
        </GameContext.Provider>
    )
}



export const useGame = () => useContext(GameContext)
