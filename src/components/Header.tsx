import { Brain } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b-2 border-blue-600 shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-lg p-2 shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-blue-700">
              Deep HR Match
            </span>
          </div>
          
          {/* Center Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl md:text-2xl font-bold text-blue-900 whitespace-nowrap">
              Employer Dashboard
            </h1>
          </div>
          
          {/* Right side - User Info and Logout Button */}
          <div className="flex items-center gap-4">
            {/* Logged in user info */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm text-slate-600">Logged in as:</span>
              <span className="text-sm font-semibold text-slate-800">Winston Tan</span>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={() => {
                // Add your logout logic here
                console.log('Logout clicked');
                // Example: handleLogout();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}