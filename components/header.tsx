import Link from "next/link"
// Removed MountainIcon import as it's no longer needed
// import { MountainIcon } from 'lucide-react'

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm">
      {" "}
      {/* Responsive padding */}
      <Link className="flex items-center justify-center gap-2" href="/">
        {/* Replaced MountainIcon with the new rocket image */}
        <img src="/images/rocket-icon.jpeg" alt="Startup Co-Pilot Rocket Icon" className="h-7 w-7" />
        <span className="text-xl font-bold text-gray-800">Startup Co-Pilot</span>
      </Link>
      <nav className="ml-auto flex gap-6 sm:gap-8">
        {" "}
        {/* Responsive spacing */}
        <Link
          className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
          href="/analyze"
        >
          Analyze
        </Link>
        
      </nav>
    </header>
  )
}
