import React from 'react'
import * as auth from '../redux/AuthRedux'
import {useDispatch} from 'react-redux'
import {actions} from '../redux/AuthRedux'
import {Module} from '../redux/AuthTypes'
import {useModules} from '../../../../setup/redux/hooks'

const Icon: React.FC<{className: string}> = (props) => {
  return (
    <div className='d-flex justify-content-center align-items-center h-70px w-90px m-0'>
      <div className='text-white bg-primary d-flex justify-content-center align-items-center rounded-circle h-70px w-70px m-0'>
        <i className={`text-white fs-1 ${props.className}`}></i>
      </div>
    </div>
  )
}

const Link: React.FC<{className: string; module: Module; title: string}> = (props) => {
  const dispatch = useDispatch()

  function selectModule(module: Module) {
    dispatch(auth.actions.setModule(module))
  }
  return (
    <a
      href='#'
      className='d-flex flex-column align-items-center w-150px'
      onClick={() => selectModule(props.module)}
    >
      <Icon className={props.className} />
      <p className='fw-bold py-2'>{props.title}</p>
    </a>
  )
}

export function ModuleSelector() {
  const modules = useModules()
  const dispatch = useDispatch()
  return (
    <>
      <div className='d-flex card shadow-sm py-3'>
        <div className='card-body text-center '>
          <h3 className='card-title '>Selecione o Módulo</h3>
        </div>
        <div className='d-flex p-3 justify-content-around'>
          {modules?.includes(Module.Admin) && (
            <Link className='fas fa-users-cog' module={Module.Admin} title='Administrador' />
          )}
          {modules?.includes(Module.Backoffice) && (
            <Link className='fas fa-laptop-code' module={Module.Backoffice} title='Backoffice' />
          )}
          {modules?.includes(Module.Auditor) && (
            <Link
              className='fas fa-search-dollar'
              module={Module.Auditor}
              title='Auditor - ISS Cartões'
            />
          )}
        </div>
        <div className='d-flex p-3 justify-content-around'>
          {modules?.includes(Module.ContribuinteDTE) && (
            <Link
              className='far fa-address-card'
              module={Module.ContribuinteDTE}
              title='Auditor - ITR'
            />
          )}
          {modules?.includes(Module.ContribuinteITR) && (
            <Link
              className='fas fa-search-dollar'
              module={Module.ContribuinteITR}
              title='Contribuinte - ITR'
            />
          )}
          {modules?.includes(Module.AuditorDTE) && (
            <Link className='fas fa-envelope' module={Module.AuditorDTE} title='Auditor - DTE' />
          )}
        </div>
        <div className='d-flex flex-center p-3 justify-context-center text-center'>
          <button
            className='btn btn-sm btn-light-primary h-40px'
            onClick={() => dispatch(actions.logout())}
          >
            Voltar
          </button>
        </div>
      </div>
    </>
  )
}
