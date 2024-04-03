/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../_metronic/assets/ts/_utils'
import {formatMoney} from '../../../utils/functions'
import {ExportReportsButton} from '../ITRDashboard'

type Props = {
  className: string
  total: number
  data: {value: number; date: string}[]
  year: number
}

const ITRUnionTransfersChart: React.FC<Props> = (props) => {
  const {className, total, data} = props
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

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Valor Arrecadado</span>
        </h3>
        <div className='card-toolbar'>
          <ExportReportsButton type='transfers' />
        </div>
      </div>

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div className='px-9 mb-5'>
          <div className='d-flex mb-2'>
            <span className='fs-4 fw-semibold text-gray-400 me-1'>R$</span>
            <span className='fs-2hx fw-bold text-gray-800 me-2 lh-1 ls-n2'>
              {formatMoney(props.total).replace('R$', '')}
            </span>
          </div>
          <span className='fs-6 fw-semibold text-gray-400'>Total de {props.year}</span>
        </div>
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{height: '350px'}}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ITRUnionTransfersChart}

function getChartOptions(height: number, data: {value: number; date: string}[]): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue('--bs-info')
  const lightColor = getCSSVariableValue('--bs-light-info')

  return {
    series: [
      {
        name: 'Valor Arrecadado',
        data: data.map((d) => d.value),
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: data.map((d) => d.date),
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
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
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
          return formatMoney(val)
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}
