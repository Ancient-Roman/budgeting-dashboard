"use client";
import React from 'react';
import { CategoryBudgetItem } from '../helpers/budgetHelpers';
import getEmojiForCategory from '../helpers/emojiHelper';

interface Props {
  item: CategoryBudgetItem;
  spent: number;
  isCurrent: boolean;
  pctRelativeToTime: number;
  pctOfMonth: number;
  over: boolean;
  onChangeAmount: (newAmount: number) => void;
  onClick?: () => void;
}

const CategoryBudgetCard: React.FC<Props> = ({ item, spent, isCurrent, pctRelativeToTime, pctOfMonth, over, onChangeAmount, onClick }) => {
  return (
    <div onClick={onClick} className={`p-3 border rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 ${onClick ? 'hover:shadow-lg hover:-translate-y-0.5 transition-transform cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="font-medium"><span className="mr-2">{getEmojiForCategory(item.category)}</span>{item.category}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Spent ${spent.toFixed(2)} / Budget ${item.amount.toFixed(2)}</div>
      </div>
      <div className="mt-2">
        <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
          <div style={{ width: `${Math.min(100, (spent / (item.amount || 1)) * 100)}%`, height: '100%', background: over ? '#ef4444' : '#22c55e' }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <div>
            {isCurrent && (
              <><span>Relative to time: <span className={over ? 'text-red-500' : 'text-green-500'}>{(pctRelativeToTime*100).toFixed(1)}%</span></span> • </>
            )}
            <span>Of month: <span className={pctOfMonth > 1 ? 'text-red-500' : 'text-green-500'}>{(pctOfMonth*100).toFixed(1)}%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <input onClick={e => e.stopPropagation()} className="w-24 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded" value={item.amount} onChange={e => onChangeAmount(Number(e.target.value || 0))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBudgetCard;
