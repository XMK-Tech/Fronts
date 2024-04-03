/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState} from 'react'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {MixedWidget2, ListsWidget6} from '../../../_metronic/partials/widgets'
import {DropZoneUp} from '../../utils/components/DropZoneUp'
const DashboardPage: FC = () => (
  <>
    <div className='row gy-5 g-xl-8'>
      <div className='col-xxl-4'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='primary'
          chartHeight='200px'
          strokeColor='#00446A'
          title='Subsidiárias'
          cards={[
            {
              color: 'primary',
              icon: 'coding/cod009.svg',
              title: 'Novas Subsidiárias',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-primary fw-bold fs-7`}>Total</span>
                  <span className={`text-primary fw-bold fs-1`}>35</span>
                  <span className={`text-primary fw-bold fs-7`}>Subsidiárias</span>
                </div>
              ),
            },
            {
              color: 'success',
              icon: '/general/gen014.svg',
              title: 'Período dos cadastros',
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
          graphicName='Subsidiárias'
          graphicResult={[20, 25, 70, 55, 30, 20, 20, 23]}
        />
      </div>
      <div className='col-xxl-4'>
        <MixedWidget2
          className='card-xl-stretch mb-xl-8'
          chartColor='info'
          chartHeight='200px'
          strokeColor='#1B192B'
          cards={[
            {
              color: 'info',
              icon: 'general/gen018.svg',
              title: 'Novos Municípios',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-info fw-bold fs-7`}>Total</span>
                  <span className={`text-info fw-bold fs-1`}>144</span>
                  <span className={`text-info fw-bold fs-7`}>Municípios</span>
                </div>
              ),
            },
            {
              color: 'dark',
              icon: '/general/gen014.svg',
              title: 'Período dos cadastros',
              rightComponent: (
                <div className='row text-center'>
                  <span className={`text-dark fw-bold fs-7`}>Inicio</span>
                  <span className={`text-dark fw-bold fs-4`}>01/10/22</span>
                  <span className={`text-dark fw-bold fs-7`}>Fim</span>
                  <span className={`text-dark fw-bold fs-4`}>25/10/22</span>
                </div>
              ),
            },
          ]}
          title='Municípios'
          graphicName='Municípios'
          graphicResult={[30, 40, 60, 30, 35, 20, 25, 20]}
        />
      </div>
    </div>
  </>
)

export function BuildingDashboard({}) {
  return (
    <>
      <div className={`card`}>
        <div className='card-body py-5 d-flex flex-column justify-content-center'>
          <div className='card-body py-3 d-flex flex-row justify-content-center'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Dashboard em breve...</span>
            </h3>
          </div>
          <div className='card-body py-3 d-flex flex-row justify-content-center'>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/illustrations/custom/building.svg')}
              className='img-fluid mh-300px'
            />
          </div>
        </div>
      </div>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

function AdminDashboard() {
  return (
    <>
      <DashboardWrapper />
    </>
  )
}

export default AdminDashboard
