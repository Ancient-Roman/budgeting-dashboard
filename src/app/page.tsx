import Image from "next/image";
import DateRangePicker from "./components/common/datePicker";
import CSVUpload from "./components/csvUploader";
import { TransactionsProvider } from "./context/transactionsContext";
import { TransactionsListDisplay } from "./components/transactionsListDisplay";
import { CsvClear } from "./components/csvClear";
import { Tabs, Tab } from "./components/common/tabs";
import { TransactionsChartDisplay } from "./components/transactionsChartDisplay";
import React from "react";
import { DarkModeToggle } from "./components/common/darkModeToggle";
import { DarkModeProviderWrapper } from "./components/client-wrappers/darkModeProviderWrapper";
import { BudgetDisplay } from "./components/budgetDisplay";
import CategoryBudget from "./components/categoryBudget";

export default function Home() {
  const tabs: Tab[] = [
    {
      id: "1",
      label: "Table",
      content: <TransactionsListDisplay />,
    },
    {
      id: "2",
      label: "Charts",
      content: <TransactionsChartDisplay />,
    },
    {
      id: "3",
      label: "Budget",
      content: <BudgetDisplay />,
    },
    {
      id: "4",
      label: "Category Budgets",
      content: <CategoryBudget />,
    }
  ];

  return (
    <TransactionsProvider>
    <DarkModeProviderWrapper>
      <div className="grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
          {/* App Title */}
          <h1 className="text-4xl font-extrabold text-center sm:text-left w-full mb-2 tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            NextBudget Dashboard
          </h1>
          <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
            <CSVUpload />
            <CsvClear />
            <DarkModeToggle />
            {/* Date Range Picker and Title inline with buttons */}
            <div className="flex flex-col items-center sm:items-start ml-auto">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-2">Select Date Range</span>
              <DateRangePicker />
            </div>
          </div>
          <Tabs tabs={tabs} />
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <p>Authored by Drew Bowman - 2025</p>
          <div className="flex flex-row">
            Built with
            <Image
              className="dark:invert ml-4"
              src="/next.svg"
              alt="Next.js logo"
              width={50}
              height={10}
              priority
            />
          </div>
        </footer>
      </div>
    </DarkModeProviderWrapper>
    </TransactionsProvider>
  );
}
