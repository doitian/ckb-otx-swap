import { BookOpenIcon } from "@heroicons/react/24/outline";
import { classnames } from "tailwindcss-classnames";

export default function AddressText({ address, explorerUrl, className }) {
  return (
    <code className={classnames(className, "truncate")}>
      <BookOpenIcon className="h-6 w-6 inline" aria-hidden="true" />{" "}
      <a
        href={`${explorerUrl}/address/${address}`}
        target="_blank"
        title={address}
        className="border-b border-dashed border-gray-400 hover:border-gray-500 transition-all"
      >
        {address}
      </a>
    </code>
  );
}
