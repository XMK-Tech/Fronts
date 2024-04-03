import {Suspense, lazy} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'

export function ITRPrivateRoutes() {
  const NotificationsPage = lazy(() => import('../modules/ITR/NotificationsPage'))
  const RegisterPersons = lazy(() => import('../modules/ITR/PersonRegisterPage'))
  const RegisterAuditor = lazy(() => import('../modules/auditor/AuditorRegisterPage'))
  const ConsultAuditor = lazy(() => import('../modules/auditor/AuditorConsultPage'))
  const RegisterFiscalProcedure = lazy(
    () => import('../modules/ITR/FIscalProcedure/FiscalProcedureRegisterPage')
  )
  const ConsultFiscalProcedure = lazy(
    () => import('../modules/ITR/FIscalProcedure/FiscalProcedureConsultPage')
  )
  const FiscalProcedureDetails = lazy(
    () => import('../modules/ITR/FIscalProcedure/FiscalProcedureDetails')
  )
  const ConsultPersons = lazy(() => import('../modules/ITR/PersonConsultPage'))
  const ITRPropertyWizard = lazy(
    () => import('../modules/ITR/Propriety/Registration/PropertyRegistration')
  )
  const ConsultProperty = lazy(() => import('../modules/ITR/PropertyConsultPage'))
  const DetailsProperty = lazy(() => import('../modules/ITR/PropertyDetailsPage'))
  const ITRDashboard = lazy(() => import('../modules/ITR/ITRDashboard'))
  const ITRCheckList = lazy(() => import('../modules/ITR/ITRCheckList'))
  const ITRCarData = lazy(() => import('../modules/ITR/ITRCarData'))
  const RegisterBareLand = lazy(() => import('../modules/ITR/RegisterBareLand'))
  const ITRDeclaration = lazy(() => import('../modules/ITR/ITRDeclaration'))
  const ReportsPageITR = lazy(()=> import('../modules/ITR/ReportsPageITR'))
  const ConsultDeclarationsPage = lazy(() => import('../modules/ITR/ConsultDeclarationsPage'))

  const AuditorSettingsAccountPage = lazy(
    () => import('../modules/auditor/AuditorSettingsAccountPage')
  )

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/ITR/NotificationsPage' component={NotificationsPage} />
        <Route path='/ITR/Dashboard' component={ITRDashboard} />
        <Route path='/ITR/RegisterPersons/:id' component={RegisterPersons} />
        <Route path='/ITR/RegisterPersons' component={RegisterPersons} />
        <Route path='/ITR/RegisterAuditor/:id' component={RegisterAuditor} />
        <Route path='/ITR/RegisterAuditor' component={RegisterAuditor} />
        <Route path='/ITR/ConsultPersons' component={ConsultPersons} />
        <Route path='/ITR/ConsultAuditor' component={ConsultAuditor} />
        <Route path='/ITR/Reports' component={ReportsPageITR} />
        <Route path='/ITR/RegisterFiscalProcedure/:id' component={RegisterFiscalProcedure} />
        <Route path='/ITR/RegisterFiscalProcedure' component={RegisterFiscalProcedure} />
        <Route path='/ITR/ITRMainPage/RegisterProperty/:id' component={ITRPropertyWizard} />
        <Route path='/ITR/ITRMainPage/RegisterProperty' component={ITRPropertyWizard} />
        <Route path='/ITR/ITRMainPage/ConsultProperty' component={ConsultProperty} />
        <Route path='/ITR/ITRMainPage/DetailsProperty/:id' component={DetailsProperty} />
        <Route path='/ITR/ConsultFiscalProcedure' component={ConsultFiscalProcedure} />
        <Route path='/ITR/FiscalProcedureDetails/:id' component={FiscalProcedureDetails} />
        <Route path='/ITR/ITRCheckList' component={ITRCheckList} />
        <Route path='/ITR/ITRCarData' component={ITRCarData} />
        <Route path='/ITR/RegisterBareLand' component={RegisterBareLand} />
        <Route path='/ITR/ITRDeclaration' component={ITRDeclaration} />
        
        <Route path='/ITR/ConsultDeclarationsPage' component={ConsultDeclarationsPage} />
        <Route path='/auditor/configuracao/conta' component={AuditorSettingsAccountPage} />
        <Redirect from='/backoffice' to='/' />
        <Redirect from='/admin' to='/' />
        <Redirect from='/auditor' to='/' />
        <Redirect from='/DTE' to='/' />
        <Redirect from='/auth' to='/' />
        <Redirect exact from='/' to='/ITR/Dashboard' />
      </Switch>
    </Suspense>
  )
}

export function ContribuinteITRPrivateRoutes() {
  const ITRDeclaration = lazy(() => import('../modules/ITR/ITRDeclaration'))
  const ReplyConsultPage = lazy(() => import('../modules/ITR/ReplyConsultPage'))

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/ITR/ITRDeclaration' component={ITRDeclaration} />
        <Route path='/ITR/ReplyConsultPage' component={ReplyConsultPage} />
        <Redirect from='/backoffice' to='/' />
        <Redirect from='/admin' to='/' />
        <Redirect from='/auth' to='/' />
        <Redirect from='/DTE' to='/' />
        <Redirect exact from='/' to='/ITR/ITRDeclaration' />
      </Switch>
    </Suspense>
  )
}
