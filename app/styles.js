import { classnames } from "tailwindcss-classnames";

export const textAccent = "text-indigo-600";

const buttonBase =
  "px-4 inline-flex justify-center items-center gap-2 rounded-md font-semibold transition-all text-sm";

const solidButtonBase = classnames(
  buttonBase,
  "py-3 border border-transparent text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
);
export const solidButton = classnames(
  solidButtonBase,
  "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
);

const outlineButtonBase = classnames(
  buttonBase,
  "py-[.688rem] border-2 border-gray-200 font-semibold hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm"
);
export const outlineButton = classnames(
  outlineButtonBase,
  "text-indigo-600 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-indigo-600"
);

const linkButtonBase = classnames(
  buttonBase,
  "py-3 border border-transparent focus:outline-none focus:ring-2 ring-offset-white focus:ring-offset-2"
);
export const linkButton = classnames(
  linkButtonBase,
  "text-indigo-600 hover:text-indigo-500 focus:ring-indigo-600"
);

export const pageTitle = classnames(
  "text-2xl",
  "font-bold",
  "leading-7",
  "mb-8",
  "text-gray-900",
  "sm:truncate",
  "sm:text-3xl",
  "sm:tracking-tight"
);

const menuItemBase = "font-medium";
export const menuItem = (isActive) =>
  isActive
    ? classnames(menuItemBase, textAccent)
    : classnames(
        menuItemBase,
        "text-gray-600",
        "hover:text-gray-400",
        "dark:text-gray-400",
        "dark:hover:text-gray-500"
      );

export const input = classnames(
  "py-3 px-4 block border-gray-200 rounded-md text-sm focus:border-indigo-600 focus:ring-indigo-600 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
);
export const disabledInput = classnames(
  input,
  "opacity-70 pointer-events-none bg-gray-50"
);
