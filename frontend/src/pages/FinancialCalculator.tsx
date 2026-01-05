import { useState } from 'react'
import { projectionService, FinancialProjection } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calculator as CalcIcon, Save } from 'lucide-react'

export default function FinancialCalculator() {
  const [formData, setFormData] = useState<FinancialProjection>({
    initialValue: 0,
    monthlyContribution: 0,
    interestRate: 0,
    period: 12,
    futureValue: 0,
  })
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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

  const handleSave = async () => {
    try {
      await projectionService.create(formData)
      alert('Projeção salva com sucesso!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar projeção')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const totalInvested =
    formData.initialValue + formData.monthlyContribution * formData.period
  const totalInterest =
    (formData.futureValue || 0) - totalInvested

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Calculadora Financeira
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Parâmetros
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor Inicial (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.initialValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initialValue: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aporte Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monthlyContribution}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyContribution: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taxa de Juros Anual (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.interestRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interestRate: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Período (meses)
              </label>
              <input
                type="number"
                min="1"
                value={formData.period}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    period: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Resultado</h2>
          {formData.futureValue > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Valor Futuro</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(formData.futureValue)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Investido</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Juros Acumulados</p>
                <p className="text-xl font-semibold text-green-600">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Preencha os parâmetros e clique em Calcular
            </div>
          )}
        </div>
      </div>

      {projectionData.length > 0 && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
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
    </div>
  )
}

