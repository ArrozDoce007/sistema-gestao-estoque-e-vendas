'use client'

import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js'
import { Download, RefreshCw } from 'lucide-react'
import jsPDF from "jspdf"
import 'jspdf-autotable'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

// Dados simulados - em uma aplicação real, isso viria da sua API
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Vendas',
      data: [38, 47, 29, 53, 48, 67],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const stockData = {
  labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'],
  datasets: [
    {
      label: 'Quantidade em Estoque',
      data: [28, 37, 55, 26, 60],
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
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 20

    // Adicionar cor de fundo
    doc.setFillColor(240, 240, 240)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Adicionar cabeçalho
    doc.setFillColor(53, 162, 235)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('Relatório de Vendas e Estoque', margin, 30)

    // Adicionar data
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(12)
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, pageWidth - margin, 50, { align: 'right' })

    // Adicionar cards de resumo
    const addCard = (title: string, value: string, x: number) => {
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(x, 60, 50, 40, 3, 3, 'F')
      doc.setTextColor(50, 50, 50)
      doc.setFontSize(10)
      doc.text(title, x + 5, 75, { maxWidth: 40 })
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(value, x + 5, 92)
    }

    addCard('Total de Vendas, Ultimos 30 Dias', 'R$ 15.231,00', margin)
    addCard('Produtos em Estoque no Total', '1.234', margin + 60)
    addCard('Produtos com Baixo Estoque', '23', margin + 120)

    // Adicionar dados de vendas
    doc.setFontSize(18)
    doc.setTextColor(50, 50, 50)
    doc.text('Vendas dos Últimos 6 Meses', margin, 120)
    const salesTableData = salesData.labels.map((month, index) => [
      month,
      Math.round(salesData.datasets[0].data[index]).toString()
    ])

    // @ts-expect-error: A função autoTable não é reconhecida pelo TypeScript devido à falta de tipagem
    doc.autoTable({
      startY: 130,
      head: [['Mês', 'Vendas']],
      body: salesTableData,
      theme: 'grid',
      headStyles: { fillColor: [53, 162, 235], textColor: [255, 255, 255] },
      styles: { cellPadding: 5, fontSize: 12 },
      columnStyles: { 1: { halign: 'right' } },
    })

    // Adicionar dados de estoque em uma nova página
    doc.addPage()
    doc.setFillColor(240, 240, 240)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    doc.setFontSize(18)
    doc.setTextColor(50, 50, 50)
    doc.text('Produtos com Estoque Abaixo de 60', margin, 30)
    const stockTableData = stockData.labels.map((product, index) => [
      product,
      stockData.datasets[0].data[index]
    ])

    // @ts-expect-error: A função autoTable não é reconhecida pelo TypeScript devido à falta de tipagem
    doc.autoTable({
      startY: 40,
      head: [['Produto', 'Quantidade']],
      body: stockTableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 99, 132], textColor: [255, 255, 255] },
      styles: { cellPadding: 5, fontSize: 12 },
      columnStyles: { 1: { halign: 'right' } },
    })

    // Salvar o PDF
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
              <CardTitle>Gráfico de Produtos Mais Vendidos no Mês Passado</CardTitle>
              <CardDescription>Top 5 produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={stockData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
