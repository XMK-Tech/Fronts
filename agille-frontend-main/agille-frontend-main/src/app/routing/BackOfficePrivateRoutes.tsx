import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import ImportsPage from '../modules/backoffice/ImportsPage'

export function BackOfficePrivateRoutes() {
  const BackofficeMunicipiosPage = lazy(() => import('../modules/backoffice/MunicipiosPage'))
  const TransferUnion = lazy(() => import('../modules/backoffice/transferUnion/TransferUnion'))
  const UserConsultPage = lazy(
    () => import('../modules/backoffice/management/Consult/UserConsultPage')
  )
  const CountyConsultPage = lazy(
    () => import('../modules/backoffice/management/Consult/CountyConsultPage')
  )
  const BackofficeImportsPage = lazy(() => import('../modules/backoffice/ImportsPage'))
  const FileValidation = lazy(() => import('../modules/backoffice/FileValidation'))
  const RobotPage = lazy(() => import('../modules/backoffice/RobotPage'))
  const CountyRegisterPage = lazy(
    () => import('../modules/backoffice/management/Register/CountyRegisterPage')
  )
  const UserRegisterPage = lazy(
    () => import('../modules/backoffice/management/Register/UserRegisterPage')
  )

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/backoffice/Municipios' component={BackofficeMunicipiosPage} />
        <Route path='/backoffice/TransferUnion' component={TransferUnion} />
        <Route path='/backoffice/gerenciamento/consulta-usuarios' component={UserConsultPage} />
        <Route path='/backoffice/gerenciamento/consulta-municipios' component={CountyConsultPage} />
        <Route path='/backoffice/importacao' component={BackofficeImportsPage} />
        <Route path='/backoffice/robo' component={RobotPage} />

        {/* <Route path='/backoffice/remocao' component={BackofficeRemovePage} /> */}
        
        <Route
          path='/backoffice/gerenciamento/cadastro-municipio/:id'
          component={CountyRegisterPage}
        />
        <Route path='/backoffice/gerenciamento/cadastro-municipio' component={CountyRegisterPage} />
        <Route path='/backoffice/gerenciamento/cadastro-usuario/:id' component={UserRegisterPage} />
        <Route path='/backoffice/gerenciamento/cadastro-usuario' component={UserRegisterPage} />
        <Route path='/backoffice/gerenciamento/cadastro-usuario/:id' component={UserRegisterPage} />
        <Route path='/backoffice/gerenciamento/validacao-arquivos' component={FileValidation} />

        <Redirect from='/admin' to='/' />
        <Redirect from='/auditor' to='/' />
        <Redirect from='/auth' to='/' />
        <Redirect from='/ITR' to='/' />
        <Redirect from='/auditor' to='/' />
        <Redirect from='/DTE' to='/' />
        <Redirect exact from='/' to='/backoffice/municipios' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
