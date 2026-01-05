import { useEffect, useState } from 'react'
import { categoryService, Category } from '../services/api'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Category>({
    name: '',
    monthlyLimit: undefined,
    color: '#3B82F6',
    icon: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Erro ao carregar categorias', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id!, formData)
      } else {
        await categoryService.create(formData)
      }
      setShowForm(false)
      setEditingCategory(null)
      setFormData({
        name: '',
        monthlyLimit: undefined,
        color: '#3B82F6',
        icon: '',
      })
      loadCategories()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar categoria')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      monthlyLimit: category.monthlyLimit,
      color: category.color || '#3B82F6',
      icon: category.icon || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      await categoryService.delete(id)
      loadCategories()
    } catch (err) {
      alert('Erro ao excluir categoria')
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'Sem limite'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingCategory(null)
            setFormData({
              name: '',
              monthlyLimit: undefined,
              color: '#3B82F6',
              icon: '',
            })
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Limite Mensal
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyLimit || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlyLimit: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cor
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="mt-1 block w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ícone
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="Nome do ícone (ex: shopping-cart)"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCategory(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Carregando...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhuma categoria cadastrada
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <li key={category.id}>
                <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color || '#3B82F6' }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Limite: {formatCurrency(category.monthlyLimit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id!)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

