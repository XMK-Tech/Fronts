import {Suspense, lazy} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'

export function DTEPrivateRoutes() {
  const ITRDashboard = lazy(() => import('../modules/ITR/ITRDashboard'))
  const DTEModelsRegister = lazy(() => import('../modules/DTE/modelDTE/RegisterModelDTEPage'))
  const DTEModelsConsult = lazy(() => import('../modules/DTE/modelDTE/ConsultModelDTEPage'))
  const Accreditation = lazy(() => import('../modules/auth/components/AccreditationPage'))
  const DetailsNotification = lazy(() => import('../modules/DTE/NoticeDTE/NoticeDTEDetails'))
  const EmitPage = lazy(() => import('../modules/DTE/NoticeDTE/EmitNoticeDTEPage'))
  const LaunchListPage = lazy(() =>
    import('../modules/DTE/NoticeDTE/NoticeDTEPage').then((module) => ({
      default: module.default.LaunchListPage,
    }))
  )
  const FindingListPage = lazy(() =>
    import('../modules/DTE/NoticeDTE/NoticeDTEPage').then((module) => ({
      default: module.default.FindingListPage,
    }))
  )
  const SummonsListPage = lazy(() =>
    import('../modules/DTE/NoticeDTE/NoticeDTEPage').then((module) => ({
      default: module.default.SummonsListPage,
    }))
  )

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/DTE/Dashboard' component={ITRDashboard} />
        <Route path='/DTE/modelos-dte/cadastro/:id' component={DTEModelsRegister} />
        <Route path='/DTE/modelos-dte/cadastro' component={DTEModelsRegister} />
        <Route path='/DTE/modelos-dte/consulta' component={DTEModelsConsult} />
        <Route path='/DTE/accreditation/cadastro' component={Accreditation} />
        <Route path='/DTE/emit/:type' component={EmitPage} />
        <Route path='/DTE/cruzamentos/launch/detalhes/:id' component={DetailsNotification} />
        <Route path='/DTE/cruzamentos/finding/detalhes/:id' component={DetailsNotification} />
        <Route path='/DTE/cruzamentos/summons/detalhes/:id' component={DetailsNotification} />
        <Route path='/DTE/cruzamentos/launch' component={LaunchListPage} />
        <Route path='/DTE/cruzamentos/finding' component={FindingListPage} />
        <Route path='/DTE/cruzamentos/summons' component={SummonsListPage} />
        <Redirect from='/backoffice' to='/' />
        <Redirect from='/admin' to='/' />
        <Redirect from='/auth' to='/' />
        <Redirect from='/ITR' to='/' />
        <Redirect from='/auditor' to='/' />
        <Redirect exact from='/' to='/DTE/Dashboard' />
      </Switch>
    </Suspense>
  )
}
