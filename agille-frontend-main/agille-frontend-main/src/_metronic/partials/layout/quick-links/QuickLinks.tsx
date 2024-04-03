/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {useDispatch} from 'react-redux'

import * as auth from '../../../../app/modules/auth/redux/AuthRedux'
import {Module} from '../../../../app/modules/auth/redux/AuthTypes'
import {useModules} from '../../../../setup/redux/hooks'

const QuickLinks: FC = () => {
  const dispatch = useDispatch()
  const modules = useModules()
  function selectModule(module: Module) {
    dispatch(auth.actions.setModule(module))
  }
  const QuickLinkIcon: React.FC<{className: string}> = (props) => {
    return (
      <div className='text-white bg-primary d-flex justify-content-center align-items-center rounded-circle h-50px w-50px m-0'>
        <i className={`text-white fs-2 ${props.className}`}></i>
      </div>
    )
  }
  const QuickLinkComponent: React.FC<{className: string; module: Module; title: string}> = (
    props
  ) => {
    return (
      <div className='col-6 text-center'>
        <a
          href='#'
          onClick={() => selectModule(props.module)}
          className='d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end border-bottom'
          data-kt-menu-trigger='click'
        >
          <QuickLinkIcon className={props.className} />

          <span className='fs-6 pt-2 fw-bold text-gray-800 mb-0'>{props.title}</span>
        </a>
      </div>
    )
  }
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px'
      data-kt-menu='true'
      id='kt_select_module_menu'
    >
      <div className='row g-0'>
        {modules?.includes(Module.Admin) && (
          <QuickLinkComponent
            className='fas fa-users-cog'
            module={Module.Admin}
            title='Administrador'
          />
        )}
        {modules?.includes(Module.Backoffice) && (
          <QuickLinkComponent
            className='fas fa-laptop-code'
            module={Module.Backoffice}
            title='Backoffice'
          />
        )}
        {modules?.includes(Module.Auditor) && (
          <QuickLinkComponent
            className='fas fa-search-dollar'
            module={Module.Auditor}
            title='Auditor - ISS Cartões'
          />
        )}
        {modules?.includes(Module.ContribuinteDTE) && (
          <QuickLinkComponent
            className='fas fa-address-card'
            module={Module.ContribuinteDTE}
            title='Auditor - ITR'
          />
        )}
        {modules?.includes(Module.AuditorDTE) && (
          <QuickLinkComponent
            className='fas fa-envelope'
            module={Module.AuditorDTE}
            title='Auditor - DTE'
          />
        )}
      </div>
    </div>
  )
}

export {QuickLinks}
