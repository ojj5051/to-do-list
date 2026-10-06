export type Todo = {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  dueDate: string;
  completed: boolean;
  order?: number;
};

export const categories = ["Work", "Personal", "Urgent"];

export const subCategoriesByCategory: Record<string, readonly string[]> = {
  Work: ["Cleaning", "Cooking"],
  Personal: ["Exercise", "Learning"],
  Urgent: ["Call", "Meeting"],
};

export function getSubCategories(category: string): readonly string[] {
  return subCategoriesByCategory[category] ?? [];
}
