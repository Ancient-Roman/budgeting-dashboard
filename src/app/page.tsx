import Image from "next/image";
import CSVUpload from "./components/csvUploader";
import { TransactionsProvider } from "./context/transactionsContext";
import { TransactionsListDisplay } from "./components/transactionsListDisplay";
import { CsvClear } from "./components/csvClear";
import { Tabs, Tab } from "./components/common/tabs";
import { TransactionsChartDisplay } from "./components/transactionsChartDisplay";

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
    }
  ];

  return (
    <TransactionsProvider>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <CSVUpload />
            <CsvClear />
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
    </TransactionsProvider>
  );
}
