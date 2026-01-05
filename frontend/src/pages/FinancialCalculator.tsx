import { useState, useEffect } from 'react'
import { projectionService, FinancialProjection } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calculator as CalcIcon, Save, Trash2, TrendingUp } from 'lucide-react'

export default function FinancialCalculator() {
  const [formData, setFormData] = useState<FinancialProjection>({
    initialValue: 0,
    monthlyContribution: 0,
    interestRate: 0,
    period: 12,
    futureValue: 0,
  })
  const [displayValues, setDisplayValues] = useState({
    initialValue: '',
    monthlyContribution: '',
    interestRate: '',
    period: '12',
  })
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [savedProjections, setSavedProjections] = useState<FinancialProjection[]>([])
  const [loadingProjections, setLoadingProjections] = useState(false)

  const calculate = async () => {
    try {
      setLoading(true)
      const result = await projectionService.calculate(formData)
      setFormData({ ...formData, futureValue: result.futureValue })

      // Gerar dados para o gráfico
      const data = []
      let currentValue = formData.initialValue
      const monthlyRate = formData.interestRate / 100 / 12

      for (let i = 0; i <= formData.period; i++) {
        data.push({
          mes: i,
          valor: currentValue,
          investido: formData.initialValue + formData.monthlyContribution * i,
        })
        if (i < formData.period) {
          currentValue = currentValue * (1 + monthlyRate) + formData.monthlyContribution
        }
      }
      setProjectionData(data)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao calcular projeção')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedProjections()
  }, [])

  const loadSavedProjections = async () => {
    try {
      setLoadingProjections(true)
      const projections = await projectionService.getAll()
      setSavedProjections(projections)
    } catch (err) {
      console.error('Erro ao carregar projeções', err)
    } finally {
      setLoadingProjections(false)
    }
  }

  const handleSave = async () => {
    try {
      await projectionService.create(formData)
      alert('Projeção salva com sucesso!')
      loadSavedProjections()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar projeção')
    }
  }

  const handleLoadProjection = (projection: FinancialProjection) => {
    setFormData({
      initialValue: projection.initialValue,
      monthlyContribution: projection.monthlyContribution,
      interestRate: projection.interestRate,
      period: projection.period,
      futureValue: projection.futureValue || 0,
    })
    setDisplayValues({
      initialValue: projection.initialValue > 0 ? formatCurrencyInput(projection.initialValue.toString()) : '',
      monthlyContribution: projection.monthlyContribution > 0 ? formatCurrencyInput(projection.monthlyContribution.toString()) : '',
      interestRate: projection.interestRate > 0 ? formatPercentageInput(projection.interestRate.toString()) : '',
      period: projection.period.toString(),
    })
    
    // Calcular automaticamente ao carregar
    if (projection.futureValue) {
      const data = []
      let currentValue = projection.initialValue
      const monthlyRate = projection.interestRate / 100 / 12

      for (let i = 0; i <= projection.period; i++) {
        data.push({
          mes: i,
          valor: currentValue,
          investido: projection.initialValue + projection.monthlyContribution * i,
        })
        if (i < projection.period) {
          currentValue = currentValue * (1 + monthlyRate) + projection.monthlyContribution
        }
      }
      setProjectionData(data)
    }
  }

  const handleDeleteProjection = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta projeção?')) return

    try {
      await projectionService.delete(id)
      loadSavedProjections()
      alert('Projeção excluída com sucesso!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir projeção')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

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
  const formatCurrencyInput = (value: string): string => {
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

  // Remove formatação de porcentagem e converte para número
  const parsePercentage = (value: string): number => {
    if (!value || value.trim() === '') return 0
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    cleaned = cleaned.replace(',', '.')
    const num = parseFloat(cleaned) || 0
    return num
  }

  // Formata porcentagem para exibição
  const formatPercentageInput = (value: string): string => {
    if (!value || value.trim() === '') return ''
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    if (!cleaned || cleaned === '0' || cleaned === '0,00' || cleaned === '0.00') return ''
    const num = parseFloat(cleaned.replace(',', '.')) || 0
    if (num === 0) return ''
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Remove formatação de número inteiro
  const parseInteger = (value: string): number => {
    if (!value || value.trim() === '') return 12
    let cleaned = value.replace(/[^\d]/g, '')
    // Remove zeros à esquerda
    if (cleaned.length > 1) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    const num = parseInt(cleaned, 10) || 12
    return num
  }

  // Formata número inteiro para exibição
  const formatIntegerInput = (value: string): string => {
    if (!value || value.trim() === '') return '12'
    let cleaned = value.replace(/[^\d]/g, '')
    // Remove zeros à esquerda
    if (cleaned.length > 1) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    const num = parseInt(cleaned, 10) || 12
    return num.toString()
  }

  const handleCurrencyChange = (field: 'initialValue' | 'monthlyContribution', value: string) => {
    // Permite digitação livre, apenas remove caracteres inválidos
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda, exceto se for apenas "0," ou "0."
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    
    setDisplayValues({ ...displayValues, [field]: cleaned })
    const numValue = parseCurrency(cleaned)
    setFormData({ ...formData, [field]: numValue })
  }

  const handlePercentageChange = (value: string) => {
    let cleaned = value.replace(/[^\d,.-]/g, '')
    // Remove zeros à esquerda
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    
    setDisplayValues({ ...displayValues, interestRate: cleaned })
    const numValue = parsePercentage(cleaned)
    setFormData({ ...formData, interestRate: numValue })
  }

  const handlePeriodChange = (value: string) => {
    let cleaned = value.replace(/[^\d]/g, '')
    // Remove zeros à esquerda
    if (cleaned.length > 1) {
      cleaned = cleaned.replace(/^0+/, '')
    }
    
    setDisplayValues({ ...displayValues, period: cleaned || '12' })
    const numValue = parseInteger(cleaned || '12')
    setFormData({ ...formData, period: numValue })
  }

  const totalInvested =
    formData.initialValue + formData.monthlyContribution * formData.period
  const totalInterest =
    (formData.futureValue || 0) - totalInvested

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calculadora Financeira
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Parâmetros
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor Inicial (R$)
              </label>
              <input
                type="text"
                value={displayValues.initialValue}
                onChange={(e) => handleCurrencyChange('initialValue', e.target.value)}
                onBlur={(e) => {
                  const formatted = formatCurrencyInput(e.target.value)
                  setDisplayValues({ ...displayValues, initialValue: formatted })
                }}
                placeholder="0,00"
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Aporte Mensal (R$)
              </label>
              <input
                type="text"
                value={displayValues.monthlyContribution}
                onChange={(e) => handleCurrencyChange('monthlyContribution', e.target.value)}
                onBlur={(e) => {
                  const formatted = formatCurrencyInput(e.target.value)
                  setDisplayValues({ ...displayValues, monthlyContribution: formatted })
                }}
                placeholder="0,00"
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Taxa de Juros Anual (%)
              </label>
              <input
                type="text"
                value={displayValues.interestRate}
                onChange={(e) => handlePercentageChange(e.target.value)}
                onBlur={(e) => {
                  const formatted = formatPercentageInput(e.target.value)
                  setDisplayValues({ ...displayValues, interestRate: formatted })
                }}
                placeholder="0,00"
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Período (meses)
              </label>
              <input
                type="text"
                value={displayValues.period}
                onChange={(e) => handlePeriodChange(e.target.value)}
                onBlur={(e) => {
                  const formatted = formatIntegerInput(e.target.value)
                  setDisplayValues({ ...displayValues, period: formatted || '12' })
                }}
                placeholder="12"
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={calculate}
                disabled={loading}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <CalcIcon className="w-4 h-4 mr-2" />
                {loading ? 'Calculando...' : 'Calcular'}
              </button>
              {formData.futureValue > 0 && (
                <button
                  onClick={handleSave}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resultado</h2>
          {formData.futureValue > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Valor Futuro</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(formData.futureValue)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Investido</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Juros Acumulados</p>
                <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Preencha os parâmetros e clique em Calcular
            </div>
          )}
        </div>
      </div>

      {projectionData.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Evolução do Investimento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#3B82F6"
                name="Valor Acumulado"
              />
              <Line
                type="monotone"
                dataKey="investido"
                stroke="#10B981"
                name="Total Investido"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Projeções Salvas
          </h2>
          {savedProjections.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {savedProjections.length} {savedProjections.length === 1 ? 'projeção' : 'projeções'}
            </span>
          )}
        </div>

        {loadingProjections ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Carregando projeções...
          </div>
        ) : savedProjections.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Nenhuma projeção salva ainda. Calcule e salve uma projeção para vê-la aqui.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedProjections.map((projection) => {
              const totalInvested = projection.initialValue + projection.monthlyContribution * projection.period
              const totalInterest = (projection.futureValue || 0) - totalInvested
              
              return (
                <div
                  key={projection.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleLoadProjection(projection)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Projeção #{projection.id}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProjection(projection.id!)
                      }}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Excluir projeção"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Valor Inicial:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(projection.initialValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Aporte Mensal:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(projection.monthlyContribution)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Taxa de Juros:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {projection.interestRate.toFixed(2)}% a.a.
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Período:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {projection.period} meses
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Valor Futuro:</span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(projection.futureValue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Juros:</span>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(totalInterest)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                      Clique para carregar
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

