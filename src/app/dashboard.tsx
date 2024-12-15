'use client'

import { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  Title, 
  Tooltip, 
  Legend,
  PointElement
} from 'chart.js'
import { Download, RefreshCw } from 'lucide-react'
import jsPDF from "jspdf";
import 'jspdf-autotable'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

// Simulated data - in a real application, this would come from your API
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Vendas',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const stockData = {
  labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'],
  datasets: [
    {
      label: 'Quantidade em Estoque',
      data: [50, 30, 40, 20, 60],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    refreshData()
  }, [])

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text('Relatório de Vendas e Estoque', 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 30)

    // Add sales data
    doc.setFontSize(14)
    doc.text('Vendas dos Últimos 6 Meses', 14, 40)
    const salesTableData = salesData.labels.map((month, index) => [
      month,
      salesData.datasets[0].data[index]
    ])
    doc.autoTable({
      startY: 45,
      head: [['Mês', 'Vendas']],
      body: salesTableData,
    })

    // Add stock data
    doc.setFontSize(14)
    doc.text('Estoque Atual', 14, doc.lastAutoTable.finalY + 20)
    const stockTableData = stockData.labels.map((product, index) => [
      product,
      stockData.datasets[0].data[index]
    ])
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Produto', 'Quantidade']],
      body: stockTableData,
    })

    // Save the PDF
    doc.save('relatorio-vendas-estoque.pdf')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={refreshData} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar Dados
            </>
          )}
        </Button>
        <Button variant="outline" onClick={exportToPDF}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Vendas</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ 15.231,00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produtos em Estoque</CardTitle>
            <CardDescription>Quantidade total</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1.234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
            <CardDescription>Abaixo do mínimo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">23</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="sales" className="mt-6">
        <TabsList>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="stock">Estoque</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Vendas</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={salesData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Estoque</CardTitle>
              <CardDescription>Top 5 produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={stockData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}