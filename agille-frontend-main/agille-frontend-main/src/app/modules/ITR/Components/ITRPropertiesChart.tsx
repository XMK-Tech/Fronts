/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../_metronic/assets/ts/_utils'

export type PropertyDashboardData = {
  hectares: string
  quantityProperty: number
  quantityFromOtherEntity: number
}

const ITRPropertiesChart: React.FC<{data: PropertyDashboardData[]}> = ({data}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, data))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, data])

  return <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '100%'}} />
}

export {ITRPropertiesChart}

function getChartOptions(height: number, data: PropertyDashboardData[]): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = [
    getCSSVariableValue('--bs-primary'),
    getCSSVariableValue('--bs-success'),
    '#2f264f',
    getCSSVariableValue('--bs-warning'),
    getCSSVariableValue('--bs-muted'),
    getCSSVariableValue('--bs-info'),
    getCSSVariableValue('--bs-danger'),
  ]

  return {
    series: [
      {
        name: 'Propriedades por área',
        data: data.map((d) => d.quantityProperty),
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        '0 até 29.99ha',
        '30 até 49.99ha',
        '50 até 199.99ha',
        '200 até 499.99ha',
        '500 até 999.99ha',
        '1000 até 4999.99ha',
        '>= 5000ha',
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val + ' propriedades'
        },
      },
    },
    colors: [
      ({dataPointIndex}: any) => {
        const color = baseColor[dataPointIndex % baseColor.length]

        return color
      },
    ],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}
