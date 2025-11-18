import { useEffect, useState } from 'react'
import { categoriesApi, Category } from '../api/services'
import Modal from '../components/Modal'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [formData, setFormData] = useState({
    name: '',
    type: 'income' as 'income' | 'expense',
    description: '',
  })

  useEffect(() => {
    loadCategories()
  }, [filterType])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const type = filterType === 'all' ? undefined : filterType
      const response = await categoriesApi.getAll(type)
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        // Note: API doesn't have update endpoint, so we'll just show an alert
        alert('ฟีเจอร์แก้ไขหมวดหมู่ยังไม่พร้อมใช้งาน')
      } else {
        await categoriesApi.create(formData)
        setIsModalOpen(false)
        resetForm()
        loadCategories()
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || 'เกิดข้อผิดพลาด')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) return

    try {
      await categoriesApi.delete(id)
      loadCategories()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการลบข้อมูล')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'income',
      description: '',
    })
    setEditingCategory(null)
  }

  const filteredCategories = categories.filter(
    (cat) => filterType === 'all' || cat.type === filterType
  )

  const incomeCategories = categories.filter((cat) => cat.type === 'income')
  const expenseCategories = categories.filter((cat) => cat.type === 'expense')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">จัดการหมวดหมู่</h2>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md font-semibold transition-all"
        >
          <Plus size={20} />
          <span>เพิ่มหมวดหมู่</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-purple-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-semibold'
                : 'bg-white/60 backdrop-blur-sm text-purple-700 hover:bg-white/80 border border-purple-200'
            }`}
          >
            ทั้งหมด ({categories.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-2 rounded-lg ${
              filterType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-white/60 backdrop-blur-sm text-purple-700 hover:bg-white/80 border border-purple-200'
            }`}
          >
            รายรับ ({incomeCategories.length})
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-2 rounded-lg ${
              filterType === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-white/60 backdrop-blur-sm text-purple-700 hover:bg-white/80 border border-purple-200'
            }`}
          >
            รายจ่าย ({expenseCategories.length})
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            ไม่มีหมวดหมู่
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-xl border-2 backdrop-blur-sm shadow-md transition-transform hover:scale-105 ${
                category.type === 'income'
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300'
                  : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      category.type === 'income'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {category.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title="เพิ่มหมวดหมู่ใหม่"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              ชื่อหมวดหมู่ *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              ประเภท *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })
              }
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="income">รายรับ</option>
              <option value="expense">รายจ่าย</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              คำอธิบาย
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white/90 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
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
              เพิ่มหมวดหมู่
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

