/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import * as auth from '../../../../app/modules/auth/redux/AuthRedux'
import {useDispatch} from 'react-redux'
import {toAbsoluteUrl} from '../../../helpers'
import {Module} from '../../../../app/modules/auth/redux/AuthTypes'
import {useSelectedModule} from '../../../../setup/redux/hooks'
const HeaderUserMenu: FC = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const moduleSelected = useSelector<RootState>(({auth}) => auth.selectedModule, shallowEqual) as
    | Module
    | undefined

  const dispatch = useDispatch()
  const logout = () => {
    dispatch(auth.actions.logout())
  }
  useSelectedModule()

  function getNameModule(selectedModule: Module | undefined) {
    if (selectedModule === Module.Admin) {
      return 'Admin'
    }
    if (selectedModule === Module.Auditor) {
      return 'Auditor'
    }
    if (selectedModule === Module.Backoffice) {
      return 'Backoffice'
    }
    if (selectedModule === Module.ContribuinteDTE) {
      return 'Auditor'
    }
    if (selectedModule === Module.ContribuinteITR) {
      return 'Contribuinte'
    }
  }
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg')} />
          </div>

          <div className='d-flex flex-column '>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {user.first_name} {user.last_name}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2 '>
                {getNameModule(useSelectedModule())}
              </span>
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary text-break  fs-7'>
              {user.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>
      {(moduleSelected === 'Auditor' || moduleSelected === 'ContribuinteDTE') && (
        <div className='menu-item px-5 my-1'>
          <Link to='/auditor/configuracao/conta' className='menu-link px-5'>
            Configuração do municipio
          </Link>
        </div>
      )}
      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sair
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
