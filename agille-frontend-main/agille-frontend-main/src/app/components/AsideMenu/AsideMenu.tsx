import React from 'react'
import {Link} from 'react-router-dom'
import {
  useAvailableEntities,
  useSelectedEntity,
  useSelectedModule,
} from '../../../setup/redux/hooks'

import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {menuMap} from '../../../_metronic/layout/components/header/HeaderWrapper'
import {Topbar} from '../../../_metronic/layout/components/header/Topbar'
import {Module} from '../../modules/auth/redux/AuthTypes'
type SubItemProps = {
  link: string
  text: string
  a?: string
}
type ItemsProps = {
  subItems: SubItemProps[]
  label: string
}
type AsideMenuProps = {
  items?: ItemsProps[]
  onExpandChanged: (expanded: boolean) => void
  expand: boolean
}

function ExpandIcon(props: {expand: boolean}) {
  return (
    <div
      style={{
        top: '30px',
        left: props.expand ? '190px' : '70px',
        zIndex: 10,
        transition: 'all 0.3s ease',
      }}
      className='btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute translate-middle rotate active bg-white'
    >
      <span
        style={{
          transition: 'all 0.5s ease',
        }}
        className={`svg-icon svg-icon-2 ${!props.expand ? 'rotate-180' : ''}`}
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            opacity='0.5'
            d='M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z'
            fill='currentColor'
          ></path>
          <path
            d='M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z'
            fill='currentColor'
          ></path>
        </svg>
      </span>
    </div>
  )
}

export default function AsideMenu(props: AsideMenuProps) {
  const {expand, onExpandChanged} = props
  const containerWidth = expand ? '225px' : '70px'
  const selectedModule = useSelectedModule() ?? Module.ContribuinteDTE

  const {entities, changeEntities} = useAvailableEntities()
  const selectedEntity = useSelectedEntity()

  return (
    <>
      <div
        onMouseEnter={() => {
          onExpandChanged && onExpandChanged(true)
        }}
        onMouseLeave={() => onExpandChanged && onExpandChanged(false)}
        id='kt_app_sidebar'
        className='d-flex app-sidebar flex-column bg-primary'
        style={{
          width: containerWidth,
          transition: 'width 0.3s ease',
          zIndex: 10,
          height: '100vh',
          position: 'absolute',
        }}
      >
        <div className='app-sidebar-logo px-6' id='kt_app_sidebar_logo'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/illustrations/custom/logoAgille.png')}
            style={{
              display: !expand ? 'none' : 'block',
              height: '130px',
            }}
          ></img>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/favIconAgille.itr.png')}
            style={{
              display: expand ? 'none' : 'block',
              marginTop: '50px',
              marginBottom: '30px',
            }}
            className='h-25px'
          ></img>

          <ExpandIcon expand={expand} />
          {/* <div
            id='kt_app_sidebar_toggle'
            className='app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute top-50 start-100 translate-middle rotate active'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='app-sidebar-minimize'
          >
            <span className='svg-icon svg-icon-2 rotate-180'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  opacity='0.5'
                  d='M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z'
                  fill='currentColor'
                ></path>
                <path
                  d='M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z'
                  fill='currentColor'
                ></path>
              </svg>
            </span>
          </div> */}
        </div>

        <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
          <div
            id='kt_app_sidebar_menu_wrapper'
            className=' app-sidebar-wrapper hover-scroll-overlay-y'
            style={{overflowX: 'hidden'}}
          >
            <div
              className='menu menu-column menu-rounded menu-sub-indention px-3'
              id='#kt_app_sidebar_menu'
              data-kt-menu='true'
              data-kt-menu-expand='false'
            >
              {menuMap[selectedModule].map((item, index) => (
                <MenuItem expand={expand} label={item.label} listItems={item.items} key={index} />
              ))}
              {entities?.length > 1 && (
                <MenuItem
                  icon={'municipios'}
                  expand={expand}
                  label={entities.find((e) => e.id === selectedEntity)?.name ?? 'Município'}
                  listItems={
                    entities.map((e) => ({
                      link: '#',
                      a: '#',
                      target: '_self',
                      text: e.name,
                      onClick: () => {
                        changeEntities(e.id)
                        window.location.reload()
                      },
                    })) ?? []
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div
          className='app-sidebar-footer flex-column-auto pt-2 pb-6 px-6'
          id='kt_app_sidebar_footer'
        >
          <Topbar expand={expand} />
        </div>
      </div>
    </>
  )
}
type ListItemsProps = {
  link: string
  text: string
  a?: string
  target?: string
  onClick?: () => void
}
type MenuItemAsideProps = {
  listItems: ListItemsProps[]
  label: string
  expand: boolean
  icon?: string
}
function MenuItem(props: MenuItemAsideProps) {
  return (
    <div
      // data-kt-menu-trigger='click'
      className='menu-item here show menu-accordion'
      data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
      data-kt-menu-placement='right-start'
    >
      <span className='menu-link mb-4'>
        <span className='menu-icon'>
          <img
            height={'24px'}
            width={'24px'}
            src={toAbsoluteUrl('/media/menu-icons/' + (props.icon ?? getFileName(props)) + '.png')}
            alt={props.label}
          />
        </span>
        <span
          style={{
            opacity: props.expand ? '1' : '0',
          }}
          className='menu-title text-white'
        >
          {props.label}
        </span>
        <span className='menu-arrow'></span>
      </span>
      <MenuDropdown {...props} />
    </div>
  )
}

function getFileName(props: MenuItemAsideProps) {
  return props.label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function MenuItemAside(props: MenuItemAsideProps) {
  return (
    <div
      data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
      data-kt-menu-placement='right-start'
      className='menu-item py-2'
    >
      <div
        className='d-flex
        flex-column
        align-items-center
        my-4
      '
      >
        <span className='menu-icon me-0 '>
          {/* <Icon className='fas fa-laptop-code' /> */}
          <img
            width={'25px'}
            height={'25px'}
            src={toAbsoluteUrl('/media/menu-icons/' + props.label.toLowerCase() + '.png')}
          ></img>
        </span>
        {props.expand && (
          <span className='menu-text text-white mw-100px fw-bolder text-center'>{props.label}</span>
        )}
      </div>

      <MenuDropdown {...props} />
    </div>
  )
}
type ItemSubMenuProps = {
  text: string
  link: string
  a?: string
  target?: string
  onClick?: () => void
}

function MenuDropdown(props: MenuItemAsideProps) {
  return (
    <div
      style={{
        overflowY: 'scroll',
        maxHeight: '90vh',
      }}
      className='menu-sub menu-sub-dropdown px-2 py-4 w-200px w-lg-225px'
    >
      <div className='menu-item'>
        <div className='menu-content'>
          <span className='menu-section fs-5 fw-bolder m ps-1 py-1'>{props.label}</span>
        </div>
      </div>
      {props.listItems.map((e, i) => (
        <ItemSubMenu
          key={i}
          a={e.a}
          link={e.link}
          text={e.text}
          onClick={e.onClick}
          target={e.target}
        />
      ))}
    </div>
  )
}

function ItemSubMenu(props: ItemSubMenuProps) {
  return (
    <div className='menu-item'>
      {props.a ? (
        <a
          className='menu-link mb-4'
          target={props.target || '_blank'}
          href={props.a}
          onClick={props.onClick}
        >
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
          <span className='menu-title'>{props.text}</span>
        </a>
      ) : (
        <Link to={props.link}>
          <span className='menu-link mb-4'>
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
            <span className='menu-title'>{props.text}</span>
          </span>
        </Link>
      )}
    </div>
  )
}
