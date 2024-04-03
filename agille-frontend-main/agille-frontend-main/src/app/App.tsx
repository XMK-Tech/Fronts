import React, {Suspense, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import {Routes} from './routing/Routes'
import * as auth from './modules/auth/redux/AuthRedux'
import {loginCertificate} from './modules/auth/redux/AuthCRUD'
import {Permission} from './modules/auth/redux/AuthTypes'
import {MenuContextProvider} from '../_metronic/layout/components/header/HeaderWrapper'

type Props = {
  basename: string
}

const App: React.FC<Props> = ({basename}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (window.location.href.includes('certificate')) {
      //TODO: Handle errors
      loginCertificate().then(({data: content}) => {
        dispatch(
          auth.actions.login(
            content.token,
            content.permissions.map(
              (perm: any): Permission => ({
                entityId: perm.permissionEntity,
                franchiseId: perm.permissionFranchise,
                isGlobal: perm.isGlobal,
                name: perm.permissionName,
              })
            ),
            content.franchises,
            content.entities
          )
        )
      })
    }
  }, [])
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter basename={basename}>
        <I18nProvider>
          <MenuContextProvider>
            <LayoutProvider>
              <AuthInit>
                <Routes />
              </AuthInit>
            </LayoutProvider>
          </MenuContextProvider>
        </I18nProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export {App}
