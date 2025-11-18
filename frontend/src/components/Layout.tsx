import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, TrendingDown, FolderTree } from 'lucide-react'
import { useCurrency } from '../contexts/CurrencyContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { currency, setCurrency, exchangeRate } = useCurrency()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/income', label: 'รายรับ', icon: TrendingUp },
    { path: '/expense', label: 'รายจ่าย', icon: TrendingDown },
    { path: '/categories', label: 'หมวดหมู่', icon: FolderTree },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg border-b border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.jpeg" 
                alt="Demona Store Logo" 
                className="h-16 w-16 object-cover rounded-full bg-white p-1 shadow-lg ring-2 ring-white/50"
              />
              <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-lg">
                DEMONA STORE
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
                  <button
                    onClick={() => setCurrency('THB')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      currency === 'THB'
                        ? 'bg-white text-purple-700 shadow-md font-semibold'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    ฿ THB
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      currency === 'USD'
                        ? 'bg-white text-purple-700 shadow-md font-semibold'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
                {exchangeRate && (
                  <div className="text-xs text-white/90 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                    1 USD = {exchangeRate.usd_to_thb.toFixed(2)} THB
                  </div>
                )}
                <nav className="flex space-x-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          isActive
                            ? 'bg-white text-purple-700 font-semibold shadow-md'
                            : 'text-white/90 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

