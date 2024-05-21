import { type ClassValue, clsx } from 'clsx'

import { twMerge } from 'tailwind-merge'
import { GameLanguages } from '../types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }

export const handleError = (error: unknown) => {
    console.error(error)
    throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
  }

  export function getRandomElement(arr : any[]) {
    if (!Array.isArray(arr)) {
      throw new Error("Girdi bir array olmalı");
    }
    if (arr.length === 0) {
      throw new Error("Array boş olmamalı");
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  export const truncateText = (text : string, maxLength : number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };


  export const calculatePercentages = (playerScore: number, opponentScore: number) => {
    const totalScore = playerScore + opponentScore;
    if (totalScore === 0) {
      return {
        playerPercentage: 50,
        opponentPercentage: 50,
      };
    }
  
    const playerPercentage = (playerScore / totalScore) * 100;
    const opponentPercentage = (opponentScore / totalScore) * 100;
  
    return {
      playerPercentage,
      opponentPercentage,
    };
  };

