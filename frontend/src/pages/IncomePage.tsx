import { useEffect, useState } from 'react'
import { incomeApi, categoriesApi, Income, Category } from '../api/services'
import { useCurrency } from '../contexts/CurrencyContext'
import Modal from '../components/Modal'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function IncomePage() {
  const { formatCurrency } = useCurrency()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    payment_method: '',
    reference: '',
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [incomesRes, categoriesRes] = await Promise.all([
        incomeApi.getAll(),
        categoriesApi.getAll('income'),
      ])
      setIncomes(incomesRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        category_id: parseInt(formData.category_id),
        date: new Date(formData.date).toISOString(),
        payment_method: formData.payment_method || undefined,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
      }

      if (editingIncome) {
        await incomeApi.update(editingIncome.id, data)
      } else {
        await incomeApi.create(data)
      }

      setIsModalOpen(false)
      setEditingIncome(null)
      resetForm()
      loadData()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'เกิดข้อผิดพลาด')
    }
  }

  const handleEdit = (income: Income) => {
    setEditingIncome(income)
    setFormData({
      amount: income.amount.toString(),
      description: income.description || '',
      category_id: income.category_id.toString(),
      date: format(new Date(income.date), "yyyy-MM-dd'T'HH:mm"),
      payment_method: income.payment_method || '',
      reference: income.reference || '',
      notes: income.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return

    try {
      await incomeApi.delete(id)
      loadData()
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      category_id: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      payment_method: '',
      reference: '',
      notes: '',
    })
  }

  const filteredIncomes = incomes.filter(
    (income) =>
      income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">จัดการรายรับ</h2>
        <button
          onClick={() => {
            resetForm()
            setEditingIncome(null)
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md font-semibold transition-all"
        >
          <Plus size={20} />
          <span>เพิ่มรายรับ</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-purple-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหารายรับ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : filteredIncomes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">ไม่มีข้อมูลรายรับ</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รายละเอียด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวนเงิน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วิธีการชำระ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อ้างอิง
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncomes.map((income) => (
                  <tr key={income.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(income.date), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {income.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {income.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(income.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {income.payment_method || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {income.reference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(income)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(income.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingIncome(null)
          resetForm()
        }}
        title={editingIncome ? 'แก้ไขรายรับ' : 'เพิ่มรายรับใหม่'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              จำนวนเงิน *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              หมวดหมู่ *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              รายละเอียด
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              วันที่และเวลา *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              วิธีการชำระเงิน
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">เลือกวิธีการชำระ</option>
              <option value="เงินสด">เงินสด</option>
              <option value="โอนเงิน">โอนเงิน</option>
              <option value="บัตรเครดิต">บัตรเครดิต</option>
              <option value="บัตรเดบิต">บัตรเดบิต</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              เลขที่อ้างอิง
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              หมายเหตุ
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingIncome(null)
                resetForm()
              }}
              className="px-4 py-2 border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-50 bg-white/80 backdrop-blur-sm transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md font-semibold transition-all"
            >
              {editingIncome ? 'บันทึกการแก้ไข' : 'เพิ่มรายรับ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

