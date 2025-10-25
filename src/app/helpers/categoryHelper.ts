
export const CATEGORY_LIST = [
  "Food & drink",
  "Health & wellness",
  "Gifts & donations",
  "Automotive",
  "Gas",
  "Travel",
  "Shopping",
  "Groceries",
  "Home",
  "Entertainment",
  "Bills & Utilities",
  "Income",
  "Uncategorized",
] as const;

export type Category = typeof CATEGORY_LIST[number];

interface Transaction {
  Description: string;
  Amount: string;
}


export function categorizeTransaction(transaction: Transaction): Category {
  const desc = transaction.Description.toLowerCase();
  const amount = transaction.Amount;

  if (Number(amount) > 0) {
    return "Income";
  }

  const keywordMap: { [key in Category]?: string[] } = {
    "Bills & Utilities": ["utility", "electric", "water", "internet", "cable", "comcast", "verizon", "t-mobile", "bill", "energy", "penstock", "Bear Granville", "insurance"],
    "Food & drink": ["restaurant", "coffee", "cafe", "bar", "mcdonald", "burger", "pizza", "kfc", "dunkin", "starbucks", "chipotle"],
    "Health & wellness": ["pharmacy", "drugstore", "doctor", "dentist", "clinic", "hospital", "vision", "chiropractor"],
    "Gifts & donations": ["donation", "gift", "charity", "nonprofit", "church"],
    "Automotive": ["auto repair", "mechanic", "car service", "tire", "oil change"],
    "Gas": ["gas", "fuel", "chevron", "shell", "exxon", "bp", "76"],
    "Travel": ["airline", "hotel", "uber", "lyft", "taxi", "airbnb", "flight", "train", "car rental"],
    "Shopping": ["amazon", "ebay", "mall", "store", "retail", "purchase", "online shopping"],
    "Groceries": ["grocery", "supermarket", "walmart", "whole foods", "trader joe", "aldi", "kroger", "safeway", "food market"],
    "Home": ["furniture", "home depot", "lowe's", "ikea", "appliance", "mattress", "bed"],
    "Entertainment": ["netflix", "spotify", "movie", "cinema", "amc", "game", "concert", "event", "show"],
  };

  for (const category in keywordMap) {
    const keywords = keywordMap[category as Category]!;
    if (keywords.some(keyword => desc.includes(keyword))) {
      return category as Category;
    }
  }

  // Optional: basic fallback logic using amount
  if (Math.abs(Number(amount)) < 20 && desc.includes("store")) {
    return "Shopping";
  }

  return "Uncategorized";
}
