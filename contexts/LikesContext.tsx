"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikesContextProps {
  likes: number;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
  stateLikes: boolean;
  setStateLikes: React.Dispatch<React.SetStateAction<boolean>>;
}

const LikesContext = createContext<LikesContextProps | undefined>(undefined);

export const useLikesContext = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikesContext must be used within a LikesContextProvider');
  }
  return context;
};

interface LikesContextProviderProps {
  children: ReactNode; // Define the type of the children prop
  like: number,
  stateLike: boolean
}

export const LikesContextProvider: React.FC<LikesContextProviderProps> = ({ children, like, stateLike }) => {
  const [likes, setLikes] = useState(like);
  const [stateLikes, setStateLikes] = useState(stateLike)

  return (
    <LikesContext.Provider value={{ likes, setLikes, stateLikes, setStateLikes  }}>
      {children}
    </LikesContext.Provider>
  );
};
