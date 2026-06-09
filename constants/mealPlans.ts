export type MealType =
  | "breakfast_only"
  | "lunch_only"
  | "dinner_only"
  | "breakfast_lunch"
  | "breakfast_dinner"
  | "lunch_dinner"
  | "full_day";

export type MealGroup = {
  label: string;
  options: { value: MealType; label: string }[];
};

export const MEAL_GROUPS: MealGroup[] = [
  {
    label: "1 Time Meal",
    options: [
      { value: "breakfast_only", label: "Breakfast Only" },
      { value: "lunch_only", label: "Lunch Only" },
      { value: "dinner_only", label: "Dinner Only" },
    ],
  },
  {
    label: "2 Times Meal",
    options: [
      { value: "breakfast_lunch", label: "Breakfast + Lunch" },
      { value: "breakfast_dinner", label: "Breakfast + Dinner" },
      { value: "lunch_dinner", label: "Lunch + Dinner" },
    ],
  },
  {
    label: "3 Times Meal",
    options: [
      { value: "full_day", label: "Breakfast + Lunch + Dinner" },
    ],
  },
];

export const MEAL_LABEL: Record<string, string> = {
  breakfast_only: "Breakfast Only",
  lunch_only: "Lunch Only",
  dinner_only: "Dinner Only",
  breakfast_lunch: "Breakfast + Lunch",
  breakfast_dinner: "Breakfast + Dinner",
  lunch_dinner: "Lunch + Dinner",
  full_day: "Breakfast + Lunch + Dinner",
};
