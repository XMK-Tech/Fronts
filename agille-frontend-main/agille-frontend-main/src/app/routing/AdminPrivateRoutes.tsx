import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import {MenuTestPage} from '../pages/MenuTestPage'

export function AdminPrivateRoutes() {
  const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const AdminConsultPage = lazy(
    () => import('../modules/admin/management/Consult/AdminConsultPage')
  )
  const SubsConsultPage = lazy(() => import('../modules/admin/management/Consult/SubsConsultPage'))
  const AdminRegisterPage = lazy(
    () => import('../modules/admin/management/Register/AdminRegisterPage')
  )
  const SubsRegisterPage = lazy(
    () => import('../modules/admin/management/Register/SubsRegisterPage')
  )
  const AdminDashboard = lazy(() => import('../modules/admin/AdminDashboard'))

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/admin/cadastro/admin/:id' component={AdminRegisterPage} />
        <Route path='/admin/cadastro/admin/' component={AdminRegisterPage} />
        <Route path='/admin/cadastro/subs/:id' component={SubsRegisterPage} />
        <Route path='/admin/cadastro/subs' component={SubsRegisterPage} />
        <Route path='/admin/consulta/admin' component={AdminConsultPage} />
        <Route path='/admin/consulta/subs' component={SubsConsultPage} />
        <Route path='/admin/dashboard' component={AdminDashboard} />
        <Route path='/admin/builder' component={BuilderPageWrapper} />
        <Route path='/admin/crafted/pages/profile' component={ProfilePage} />
        <Route path='/admin/crafted/pages/wizards' component={WizardsPage} />
        <Route path='/admin/crafted/widgets' component={WidgetsPage} />
        <Route path='/admin/crafted/account' component={AccountPage} />
        <Route path='/admin/apps/chat' component={ChatPage} />
        <Route path='/admin/menu-test' component={MenuTestPage} />
        <Redirect from='/backoffice' to='/' />
        <Redirect from='/auditor' to='/' />
        <Redirect from='/auth' to='/' />
        <Redirect from='/ITR' to='/' />
        <Redirect from='/DTE' to='/' />
        <Redirect exact from='/' to='/admin/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
