import HeroSection from "../components/hero-section";

export default function Init() {
  return (
    <HeroSection>
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          App Not Configured
        </h2>
        <pre className="border rounded p-4 mt-6 text-lg leading-8 text-gray-600">
          <code>npm run init</code>
        </pre>
      </div>
    </HeroSection>
  );
}
