/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {propTypes} from 'react-bootstrap-v5/lib/esm/Image'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {MixedWidget2} from '../../../_metronic/partials/widgets'
import {BuildingDashboard} from '../admin/AdminDashboard'
const DashboardPage: FC = () => (
  <div className='card p-10'>
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='primary'
          chartHeight='200px'
          strokeColor='#00446A'
          title='Importações'
          cards={[
            {
              color: 'primary',
              icon: '/files/fil003.svg',
              title: 'Total de importações',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-primary fw-bold fs-7`}>Total</span>
                  <span className={`text-primary fw-bold fs-1`}>234</span>
                  <span className={`text-primary fw-bold fs-7`}>Importações</span>
                </div>
              ),
            },
            {
              color: 'success',
              icon: '/general/gen014.svg',
              title: 'Periodo das importações',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-success fw-bold fs-7`}>Inicio</span>
                  <span className={`text-success fw-bold fs-4`}>01/10/22</span>
                  <span className={`text-success fw-bold fs-7`}>Fim</span>
                  <span className={`text-success fw-bold fs-4`}>25/10/22</span>
                </div>
              ),
            },
          ]}
          graphicName='Importações'
          graphicResult={[20, 35, 70, 55, 30, 20, 20, 23]}
        />
      </div>
      <div className='col-xxl-4'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='danger'
          chartHeight='200px'
          strokeColor='#AB0113'
          cards={[
            {
              color: 'danger',
              icon: '/files/fil007.svg',
              title: 'Total de divergências ',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-danger fw-bold fs-7`}>Total</span>
                  <span className={`text-danger fw-bold fs-1`}>234</span>
                  <span className={`text-danger fw-bold fs-7`}>Divergências</span>
                </div>
              ),
            },
            {
              color: 'warning',
              icon: '/general/gen014.svg',
              title: 'Periodo das divergências',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-warning fw-bold fs-7`}>Inicio</span>
                  <span className={`text-warning fw-bold fs-4`}>01/10/22</span>
                  <span className={`text-warning fw-bold fs-7`}>Fim</span>
                  <span className={`text-warning fw-bold fs-4`}>25/10/22</span>
                </div>
              ),
            },
          ]}
          title='Divergências'
          graphicName='Divergências'
          graphicResult={[30, 40, 60, 30, 35, 20, 25, 20]}
        />
      </div>
      <div className='col-xxl-4'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='success'
          chartHeight='200px'
          strokeColor='#154f02'
          cards={[
            {
              color: 'success',
              icon: '/files/fil007.svg',
              title: 'Valor total ',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-success fw-bold fs-7`}>Total</span>
                  <span className={`text-success fw-bold fs-1`}>R$ 8.209.158,30</span>
                  <span className={`text-success fw-bold fs-7`}>Volumetria</span>
                </div>
              ),
            },
            {
              color: 'primary',
              icon: '/general/gen014.svg',
              title: 'Periodo das volumetrias',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-primary fw-bold fs-7`}>Inicio</span>
                  <span className={`text-primary fw-bold fs-4`}>01/10/22</span>
                  <span className={`text-primary fw-bold fs-7`}>Fim</span>
                  <span className={`text-primary fw-bold fs-4`}>25/10/22</span>
                </div>
              ),
            },
          ]}
          title='Volumetria das operações'
          graphicName='Volumetria das operações'
          graphicResult={[30, 40, 60, 30, 35, 20, 25, 20]}
        />
      </div>
    </div>
  </div>
)

// const DashboardWrapper: FC = () => {
//   const intl = useIntl()
//   return (
//     <>
//       <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
//       <DashboardPage />
//     </>
//   )
// }
function AuditorDashboard() {
  // return <BuildingDashboard />
  return <DashboardPage />
}

export default AuditorDashboard
