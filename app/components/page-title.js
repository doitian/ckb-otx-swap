export default function PageTitle({ children }) {
  return (
    <h2 class="text-2xl font-bold leading-7 mb-8 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
      {children}
    </h2>
  );
}
