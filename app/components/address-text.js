import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function AddressText({ address }) {
  return (
    <code>
      <BookOpenIcon className="h-6 w-6 inline" aria-hidden="true" /> {address}
    </code>
  );
}
