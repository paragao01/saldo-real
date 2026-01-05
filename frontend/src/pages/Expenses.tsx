import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { expenseService, Expense, categoryService, Category } from '../services/api'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
    minAmount: '',
    maxAmount: '',
    paymentMethod: '',
  })
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadCategories()
    loadExpenses()
  }, [])

  useEffect(() => {
    loadExpenses()
  }, [filters])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Erro ao carregar categorias', err)
    }
  }

  const loadExpenses = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: 0,
        size: 100,
        sortBy: 'date',
        sortDir: 'desc',
      }

      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      if (filters.categoryId) params.categoryId = filters.categoryId
      if (filters.minAmount) params.minAmount = filters.minAmount
      if (filters.maxAmount) params.maxAmount = filters.maxAmount
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod

      const response = await expenseService.getAll(params)
      setExpenses(response.content || [])
      
      const totalResponse = await expenseService.getTotal(params)
      setTotal(totalResponse || 0)
    } catch (err) {
      console.error('Erro ao carregar despesas', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return

    try {
      await expenseService.delete(id)
      loadExpenses()
    } catch (err) {
      alert('Erro ao excluir despesa')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || 'N/A'
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lançamentos</h1>
        <Link
          to="/expenses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Lançamento
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Valor Mínimo
            </label>
            <input
              type="number"
              step="0.01"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Valor Máximo
            </label>
            <input
              type="number"
              step="0.01"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Forma de Pagamento
            </label>
            <input
              type="text"
              value={filters.paymentMethod}
              onChange={(e) =>
                setFilters({ ...filters, paymentMethod: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">
            Total: {formatCurrency(total)}
          </div>
          <button
            onClick={() =>
              setFilters({
                startDate: '',
                endDate: '',
                categoryId: '',
                minAmount: '',
                maxAmount: '',
                paymentMethod: '',
              })
            }
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma despesa encontrada
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <li key={expense.id}>
                <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {expense.description}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Link
                          to={`/expenses/edit/${expense.id}`}
                          className="text-gray-400 hover:text-gray-500 mr-3"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(expense.id!)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {format(new Date(expense.date), 'dd/MM/yyyy')}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {getCategoryName(expense.categoryId)}
                        </p>
                        {expense.paymentMethod && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {expense.paymentMethod}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
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

