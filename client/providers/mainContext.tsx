"use client"
import { createContext, useContext, useState } from "react";

type MainContextProviderProps = {
  children: React.ReactNode;
};

export type MainContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  changedLanguage :boolean;
  setChangedLanguage: (arg: boolean) => void
  modalStatus: { modalId: string; mode: boolean; }[];
  setModalStatus: React.Dispatch<React.SetStateAction<{ modalId: string; mode: boolean; }[] >>;
  sceneState: 'introScene'|'lobbyScene'|'gameScene';
  setSceneState: React.Dispatch<React.SetStateAction<'introScene'|'lobbyScene'|'gameScene'>>;
};

export const MainContext = createContext<MainContextType | null>(null);

export default function MainContextProvider({ children }: MainContextProviderProps) {

  type modalStatus = {
    modalId: string;
    mode: boolean;
  }

  type sceneState = 'introScene'|'lobbyScene'|'gameScene';


  const [loading, setLoading] = useState(false)
  const [sceneState, setSceneState] = useState<sceneState>('introScene');
  const [modalStatus, setModalStatus] = useState<modalStatus[]>([]);
  const [changedLanguage, setChangedLanguage] = useState(false)

  const valueData ={
    loading,
    setLoading,
    changedLanguage,
    setChangedLanguage,
    modalStatus,
    setModalStatus, 
    sceneState, 
    setSceneState
  }
  
  return (
    <MainContext.Provider value={valueData}>
      {children}
    </MainContext.Provider>
  )
}

export const useMainContext = () => {
  const context = useContext(MainContext);

  if (context === null) {
    throw new Error(
      "useMainContext must be used within an MainContextProvider"
    );
  }

  return context;
}

