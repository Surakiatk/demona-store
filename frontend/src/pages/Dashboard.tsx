import { useEffect, useState } from 'react'
import { dashboardApi, DashboardStats } from '../api/services'
import StatCard from '../components/StatCard'
import { useCurrency } from '../contexts/CurrencyContext'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  const { formatCurrency, convertAmount } = useCurrency()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  })

  useEffect(() => {
    loadStats()
  }, [dateRange])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await dashboardApi.getStats({
        start_date: format(dateRange.start, "yyyy-MM-dd'T'HH:mm:ss"),
        end_date: format(dateRange.end, "yyyy-MM-dd'T'HH:mm:ss"),
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">ไม่สามารถโหลดข้อมูลได้</div>
      </div>
    )
  }

  // เตรียมข้อมูลสำหรับกราฟรายเดือน (แปลงเป็นสกุลเงินที่เลือก)
  const monthlyData = Object.keys({ ...stats.income_by_month, ...stats.expense_by_month })
    .sort()
    .map((month) => ({
      month,
      รายรับ: convertAmount(stats.income_by_month[month] || 0, 'THB'),
      รายจ่าย: convertAmount(stats.expense_by_month[month] || 0, 'THB'),
    }))

  // เตรียมข้อมูลสำหรับ Pie Chart รายรับ (แปลงเป็นสกุลเงินที่เลือก)
  const incomePieData = Object.entries(stats.income_by_category).map(([name, value]) => ({
    name,
    value: convertAmount(value, 'THB'),
  }))

  // เตรียมข้อมูลสำหรับ Pie Chart รายจ่าย (แปลงเป็นสกุลเงินที่เลือก)
  const expensePieData = Object.entries(stats.expense_by_category).map(([name, value]) => ({
    name,
    value: convertAmount(value, 'THB'),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h2>
        <div className="flex space-x-2">
          <input
            type="date"
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
            className="px-3 py-2 border border-purple-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <input
            type="date"
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
            className="px-3 py-2 border border-purple-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="รายรับทั้งหมด"
          value={formatCurrency(stats.total_income)}
          icon={TrendingUp}
          color="green"
          subtitle={`${stats.income_count} รายการ`}
        />
        <StatCard
          title="รายจ่ายทั้งหมด"
          value={formatCurrency(stats.total_expense)}
          icon={TrendingDown}
          color="red"
          subtitle={`${stats.expense_count} รายการ`}
        />
        <StatCard
          title="กำไรสุทธิ"
          value={formatCurrency(stats.net_profit)}
          icon={DollarSign}
          color={stats.net_profit >= 0 ? 'blue' : 'red'}
        />
        <StatCard
          title="อัตรากำไร"
          value={stats.total_income > 0 
            ? `${((stats.net_profit / stats.total_income) * 100).toFixed(1)}%`
            : '0%'}
          icon={BarChart3}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">แนวโน้มรายเดือน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="รายรับ" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="รายจ่าย" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bar Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">เปรียบเทียบรายเดือน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="รายรับ" fill="#10b981" />
              <Bar dataKey="รายจ่าย" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">รายรับแยกตามหมวดหมู่</h3>
          {incomePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              ไม่มีข้อมูล
            </div>
          )}
        </div>

        {/* Expense by Category */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">รายจ่ายแยกตามหมวดหมู่</h3>
          {expensePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              ไม่มีข้อมูล
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

