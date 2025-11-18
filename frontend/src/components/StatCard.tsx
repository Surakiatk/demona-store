import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'green' | 'red' | 'blue' | 'purple'
  subtitle?: string
}

export default function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    green: 'bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 border-emerald-300 shadow-md',
    red: 'bg-gradient-to-br from-rose-50 to-red-50 text-rose-700 border-rose-300 shadow-md',
    blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 border-blue-300 shadow-md',
    purple: 'bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-700 border-purple-300 shadow-md',
  }

  return (
    <div className={`rounded-xl border-2 p-6 backdrop-blur-sm ${colorClasses[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-75">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-white/60 backdrop-blur-sm shadow-sm`}>
          <Icon size={32} className={color === 'green' ? 'text-emerald-600' : color === 'red' ? 'text-rose-600' : color === 'blue' ? 'text-blue-600' : 'text-purple-600'} />
        </div>
      </div>
    </div>
  )
}

