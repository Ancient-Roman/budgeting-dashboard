"use client";

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { reducer, initialState, TransactionsState, Action } from '../reducers/transactions';

type TransactionsContextType = {
  state: TransactionsState;
  dispatch: React.Dispatch<Action>;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TransactionsContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within an TransactionsProvider');
  }
  return context;
};
