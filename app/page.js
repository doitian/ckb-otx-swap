import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import HeroSection from "./components/hero-section";

export default function Home() {
  return (
    <HeroSection>
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Hello
        </h2>

        <Link
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 ring-offset-gray-50 focus:ring-indigo-600 focus:ring-offset-2 transition-all text-sm py-3 px-4 dark:ring-offset-slate-900"
          href="/assets"
        >
          Go to Assets List{" "}
          <ChevronRightIcon className="w-2.5 h-2.5 inline" />
        </Link>
      </div>
    </HeroSection>
  );
}
