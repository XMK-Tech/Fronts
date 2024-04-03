import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'

export function AuditorPrivateRoutes() {
  const AuditorDashboard = lazy(() => import('../modules/auditor/AuditorDashboard'))

  const AuditorImportsPage = lazy(() => import('../modules/auditor/AuditorImportsPage'))

  const AuditorImportStatusPage = lazy(() => import('../modules/auditor/AuditorImportStatusPage'))

  const NewCrossingPage = lazy(() => import('../modules/auditor/NewCrossingPage'))

  const CrossListPage = lazy(() => import('../modules/auditor/CrossListPage'))
  const CrossListDetails = lazy(() => import('../modules/auditor/CrossListDetails'))
  const AuditorRegisterPage = lazy(() => import('../modules/auditor/AuditorRegisterPage'))
  const AuditorConsultPage = lazy(() => import('../modules/auditor/AuditorConsultPage'))

  const TaxPayerRegisterPage = lazy(
    () => import('../modules/auditor/register/TaxPayerRegisterPage')
  )
  const TaxPayerConsultPage = lazy(() => import('../modules/auditor/consult/TaxPayerConsultPage'))
  const CardOperatorConsultPage = lazy(
    () => import('../modules/auditor/consult/CardOperatorConsultPage')
  )

  const RegisterModelPage = lazy(() => import('../modules/auditor/model/RegisterModelPage'))

  const ConsultModelPage = lazy(() => import('../modules/auditor/model/ConsultModelPage'))

  const AuditorSettingsAccountPage = lazy(
    () => import('../modules/auditor/AuditorSettingsAccountPage')
  )

  const WarningListPage = lazy(() =>
    import('../modules/auditor/NotificationListPage').then((module) => ({
      default: module.default.WarningListPage,
    }))
  )
  const NoticeListPage = lazy(() =>
    import('../modules/auditor/NotificationListPage').then((module) => ({
      default: module.default.NoticeListPage,
    }))
  )
  const DetailsNotification = lazy(() => import('../modules/auditor/DetailsNotification'))

  const TaxesRegisterPage = lazy(() => import('../modules/auditor/taxes/TaxesRegisterPage'))

  const CardOperatorReport = lazy(() => import('../modules/auditor/consult/CardOperatorReport'))
  const CardOperatorReportList = lazy(
    () => import('../modules/auditor/consult/CardOperatorReportList')
  )

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/auditor/inicio/dashboard' component={AuditorDashboard} />

        <Route path='/auditor/importacao/nova-importacao' component={AuditorImportsPage} />

        <Route path='/auditor/importacao/status-importacao' component={AuditorImportStatusPage} />
        <Route path='/auditor/cruzamentos/autuacoes/detalhes/:id' component={DetailsNotification} />
        <Route path='/auditor/cruzamentos/autuacoes' component={WarningListPage} />
        <Route
          path='/auditor/cruzamentos/notificacoes/detalhes/:id'
          component={DetailsNotification}
        />
        <Route path='/auditor/cruzamentos/notificacoes' component={NoticeListPage} />

        <Route path='/auditor/cruzamentos/novo-cruzamento' component={NewCrossingPage} />

        <Route path='/auditor/cruzamentos/operadoras/detalhes/:id' component={CardOperatorReport} />
        <Route path='/auditor/cruzamentos/operadoras' component={CardOperatorReportList} />
        <Route
          path='/auditor/cruzamentos/lista-cruzamentos/detalhes'
          component={CrossListDetails}
        />
        <Route path='/auditor/cruzamentos/lista-cruzamentos' component={CrossListPage} />

        <Route
          path='/auditor/administrativo/cadastro-auditor/:id'
          component={AuditorRegisterPage}
        />
        <Route path='/auditor/administrativo/cadastro-auditor' component={AuditorRegisterPage} />
        <Route path='/auditor/administrativo/consulta-auditores' component={AuditorConsultPage} />

        <Route path='/auditor/configuracao/conta' component={AuditorSettingsAccountPage} />

        <Route
          path='/auditor/cadastros/cadastro-contribuintes/:id'
          component={TaxPayerRegisterPage}
        />
        <Route path='/auditor/cadastros/cadastro-contribuintes' component={TaxPayerRegisterPage} />

        <Route path='/auditor/cadastros/consulta-contribuintes' component={TaxPayerConsultPage} />

        <Route
          path='/auditor/cadastros/consulta-operadoras/cadastro-taxas/:id'
          component={TaxesRegisterPage}
        />
        <Route path='/auditor/cadastros/consulta-operadoras' component={CardOperatorConsultPage} />

        <Route path='/auditor/cadastros/cadastro-modelo/:id' component={RegisterModelPage} />
        <Route path='/auditor/cadastros/cadastro-modelo' component={RegisterModelPage} />
        <Route path='/auditor/cadastros/consulta-modelos' component={ConsultModelPage} />

        <Route path='/auditor/configuracao/conta' component={AuditorSettingsAccountPage} />

        <Redirect from='/backoffice' to='/' />
        <Redirect from='/admin' to='/' />
        <Redirect from='/auth' to='/' />
        <Redirect from='/ITR' to='/' />
        <Redirect from='/auditor' to='/' />
        <Redirect from='/DTE' to='/' />
        <Redirect exact from='/' to='/auditor/inicio/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
