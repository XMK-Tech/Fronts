/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {FC} from 'react'
import {Redirect, Switch, Route, useLocation} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {AdminPrivateRoutes} from './AdminPrivateRoutes'
import {Logout, AuthPage} from '../modules/auth'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {RootState} from '../../setup'
import {MasterInit} from '../../_metronic/layout/MasterInit'
import {BackOfficePrivateRoutes} from './BackOfficePrivateRoutes'
import {AuditorPrivateRoutes} from './AuditorPrivateRoutes'
// import {DTEAuditorPrivateRoutes} from './DTEAuditorPrivateRoutes'
import {ContribuinteITRPrivateRoutes, ITRPrivateRoutes} from './ITRPrivateRoutes'
import Module from 'module'
import {AccreditationPage} from '../modules/auth/components/AccreditationPage'
import {useIsAccreditation} from '../../setup/redux/useIsAccreditation'
import {DTEPrivateRoutes} from './DTEPrivateRoutes'

const selectModuleRoute: React.FC<string> = (moduleSelected) => {
  if (moduleSelected === 'Admin') {
    return <AdminPrivateRoutes />
  }
  if (moduleSelected === 'Backoffice') {
    return <BackOfficePrivateRoutes />
  }
  if (moduleSelected === 'Auditor') {
    return <AuditorPrivateRoutes />
  }
  if (moduleSelected === 'ContribuinteDTE') {
    return <ITRPrivateRoutes />
  }
  if (moduleSelected === 'ContribuinteITR') {
    return <ContribuinteITRPrivateRoutes />
  }
  if (moduleSelected === 'AuditorDTE') {
    return <DTEPrivateRoutes />
  }
  return <></>
}
const Routes: FC = () => {
  const isAuthorized = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  const moduleSelected = useSelector<RootState>(({auth}) => auth.selectedModule, shallowEqual) as
    | string
    | undefined
  const isAccreditationPage = useIsAccreditation()
  return (
    <>
      <Switch>
        {!isAuthorized || !moduleSelected ? (
          /*Render auth page when user at `/auth` and not authorized.*/
          <>
            <Route path='/credenciamento/:id' component={AccreditationPage} />

            {!isAccreditationPage && (
              <Route>
                <AuthPage />
              </Route>
            )}
          </>
        ) : (
          /*Otherwise redirect to root page (`/`)*/
          <Redirect from='/auth' to='/' />
        )}

        <Route path='/error' component={ErrorsPage} />
        <Route path='/logout' component={Logout} />

        {!isAuthorized || !moduleSelected ? (
          /*Redirect to `/auth` when user is not authorized*/
          <>
            <Route path='/credenciamento/:tenantId' component={AccreditationPage} />
            {!isAccreditationPage && <Redirect to='/auth/login' />}
          </>
        ) : (
          <MasterLayout>{selectModuleRoute(moduleSelected)}</MasterLayout>
        )}
      </Switch>
      <MasterInit />
    </>
  )
}

export {Routes}
