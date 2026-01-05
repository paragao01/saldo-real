import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { expenseService, Expense, categoryService, Category } from '../services/api'

export default function ExpenseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<Expense>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    categoryId: 0,
    amount: 0,
    paymentMethod: '',
    barcode: '',
    recurring: false,
    observations: '',
  })
  const [displayAmount, setDisplayAmount] = useState('')

  // Remove formatação e converte para número
  const parseCurrency = (value: string): number => {
    if (!value || value.trim() === '') return 0
    // Remove tudo exceto números, vírgula e ponto
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda, exceto se for apenas "0," ou "0."
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    // Substitui vírgula por ponto
    cleaned = cleaned.replace(',', '.')
    const num = parseFloat(cleaned) || 0
    return num
  }

  // Formata valor monetário para exibição
  const formatCurrencyInput = (value: string | number): string => {
    if (typeof value === 'number') {
      if (value === 0) return ''
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    }
    
    if (!value || value.trim() === '') return ''
    // Remove caracteres não numéricos exceto vírgula e ponto
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda, exceto se for apenas "0," ou "0."
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    if (!cleaned || cleaned === '0' || cleaned === '0,00' || cleaned === '0.00') return ''
    // Converte vírgula para ponto para parsing
    const num = parseFloat(cleaned.replace(',', '.')) || 0
    if (num === 0) return ''
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const handleAmountChange = (value: string) => {
    // Permite digitação livre, apenas remove caracteres inválidos
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda, exceto se for apenas "0," ou "0."
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    
    setDisplayAmount(cleaned)
    const numValue = parseCurrency(cleaned)
    setFormData({ ...formData, amount: numValue })
  }

  useEffect(() => {
    loadCategories()
    if (id) {
      loadExpense()
    }
  }, [id])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
      if (data.length > 0 && !id) {
        setFormData((prev) => ({ ...prev, categoryId: data[0].id! }))
      }
    } catch (err) {
      console.error('Erro ao carregar categorias', err)
    }
  }

  const loadExpense = async () => {
    try {
      const expense = await expenseService.getById(Number(id))
      setFormData({
        ...expense,
        date: expense.date.split('T')[0],
      })
      // Formata o valor para exibição
      if (expense.amount > 0) {
        setDisplayAmount(formatCurrencyInput(expense.amount))
      } else {
        setDisplayAmount('')
      }
    } catch (err) {
      console.error('Erro ao carregar despesa', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Valida se o valor é maior que zero
    if (formData.amount <= 0) {
      alert('O valor deve ser maior que zero')
      return
    }
    
    setLoading(true)

    try {
      if (id) {
        await expenseService.update(Number(id), formData)
      } else {
        await expenseService.create(formData)
      }
      navigate('/expenses')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar despesa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? 'Editar Lançamento' : 'Novo Lançamento'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: Number(e.target.value) })
              }
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor *
            </label>
            <input
              type="text"
              required
              value={displayAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onBlur={(e) => {
                const formatted = formatCurrencyInput(e.target.value)
                setDisplayAmount(formatted)
              }}
              placeholder="0,00"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Forma de Pagamento
            </label>
            <input
              type="text"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Código de Barras
            </label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) =>
                setFormData({ ...formData, barcode: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) =>
                  setFormData({ ...formData, recurring: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Despesa Recorrente
              </span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Observações
            </label>
            <textarea
              rows={3}
              value={formData.observations}
              onChange={(e) =>
                setFormData({ ...formData, observations: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}

