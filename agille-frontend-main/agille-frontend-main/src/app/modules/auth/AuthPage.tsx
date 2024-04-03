/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FirstAccess} from './components/FirstAccess'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PasswordRecoveryCode} from './components/PasswordRecoveryCode'
import {ChangePassword} from './components/ChangePassword'
import {PasswordChanged} from './components/PasswordChanged'
import {FirstAcessCode} from './components/FirstAccessCode'
import {CreatePassword} from './components/CreatePassword'
import {PasswordCreated} from './components/PasswordCreated'
import {ModuleSelector} from './components/ModuleSelector'
import {useSelector, shallowEqual} from 'react-redux'
import {RootState} from '../../../setup'
import {useModules} from '../../../setup/redux/hooks'
import {AccreditationChange} from './components/AccreditationChanged'
import {ContactLink} from '../../../components/ContactLink'
import {useIsAccreditation} from '../../../setup/redux/useIsAccreditation'

export function AuthPage() {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])
  const isModuleSelected = useSelector<RootState>(({auth}) => auth.selectedModule, shallowEqual)
  const isAuthorized = useSelector<RootState>(({auth}) => auth.accessToken, shallowEqual)
  const modules = useModules()
  const isAccreditationPage = useIsAccreditation()
  return (
    <div className='bg-white d-flex flex-row h-100'>
      <div
        className='flex-grow-1 h-100 w-30 d-flex flex-center flex-column w-150px'
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundImage: `url('${toAbsoluteUrl('/media/misc/gradiente.png')}')`,
        }}
      >
        <a href='#' className='d-flex flex-row mb-12 justify-content-center'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/logoAgille.png')}
            className='w-50'
          />
        </a>
        {/* end::Logo */}
      </div>
      {/* begin::Content */}
      <div className='flex-grow-1 flex-column bg-gray-300 d-flex flex-center '>
        {/* begin::Wrapper */}
        <div className='w-350px'>
          <Switch>
            {(!isModuleSelected && !isAuthorized) || !modules?.length ? (
              <>
                <Route path='/auth/login' component={Login} />
                <Route path='/auth/first-access' component={FirstAccess} />
                <Route path='/auth/first-access-code' component={FirstAcessCode} />
                <Route path='/auth/AccreditationChanged' component={AccreditationChange} />
                <Route path='/auth/create-password' component={CreatePassword} />
                <Route path='/auth/password-created' component={PasswordCreated} />
                <Route path='/auth/forgot-password' component={ForgotPassword} />
                <Route path='/auth/password-recovery-code' component={PasswordRecoveryCode} />
                <Route path='/auth/change-password' component={ChangePassword} />
                <Route path='/auth/password-changed' component={PasswordChanged} />
                {!isAccreditationPage && <Redirect from='/auth' exact={true} to='/auth/login' />}
              </>
            ) : (
              <>
                {!isModuleSelected && (
                  <Route path='/auth/module-selector' component={ModuleSelector} />
                )}
                <Redirect to='/auth/module-selector' />
              </>
            )}
          </Switch>
        </div>
        {/* end::Wrapper */}
        {/* begin::Footer */}
        <div className='d-flex p-10'>
          <div className='d-flex align-items-center fw-bold fs-6'>
            <a href='#' className='text-muted text-hover-primary px-2'>
              Termos
            </a>
            <ContactLink />
          </div>
        </div>
        {/* end::Footer */}
      </div>
      {/* end::Content */}
    </div>
  )
}
