import clsx from 'clsx'
import dayjs from 'dayjs'
import React, {FC, useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap-v5'
import {getNotification} from '../../../../app/services/PersonApi'
import {useModules} from '../../../../setup/redux/hooks'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, QuickLinks} from '../../../partials'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'svg-icon-1'

const Topbar: FC<{expand: boolean}> = (props) => {
  const modules = useModules()

  const modulesLength = modules?.length || 0
  return (
    <div
      style={{
        transition: 'all 0.3s ease-in-out',
      }}
      className={`topbar d-flex justify-content-center align-items-center ${
        props.expand ? 'flex-row' : 'flex-column'
      } flex-shrink-0`}
    >
      {/* Quick links */}
      {modulesLength > 1 && (
        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          {/* begin::Menu wrapper */}
          <div
            className={clsx(
              'btn btn-icon btn-active-light-primary position-relative',
              toolbarButtonHeightClass
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <KTSVG
              path='/media/icons/duotune/general/gen025.svg'
              className={toolbarButtonIconSizeClass}
            />
          </div>
          <QuickLinks />
          {/* end::Menu wrapper */}
        </div>
      )}
      {/* begin::Notifications */}
      <NotificationsIcon className={clsx('d-flex align-items-center', toolbarButtonMarginClass)} />
      {/* end::Notifications */}
      {/* begin::User */}
      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          <img
            className='h-25px w-25px rounded'
            src={toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg')}
            alt='metronic'
          />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}
    </div>
  )
}
type CustomToggleProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {}
}
const CustomToggle = React.forwardRef(
  (props: CustomToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
    <a
      href=''
      ref={ref}
      onClick={(e) => {
        e.preventDefault()
        props.onClick?.(e)
      }}
    >
      {props.children}
    </a>
  )
)

function BellIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='30' height='31' viewBox='0 0 30 31' fill='none'>
      <path
        d='M15 2.55566C8.1 2.55566 2.5 8.28011 2.5 15.3334C2.5 22.3868 8.1 28.1112 15 28.1112C21.9 28.1112 27.5 22.3868 27.5 15.3334C27.5 8.28011 21.9 2.55566 15 2.55566ZM15 23.639C13.9625 23.639 13.125 22.7829 13.125 21.7223H16.875C16.875 22.7829 16.0375 23.639 15 23.639ZM21.25 20.4445H8.75V19.1668L10 17.889V14.554C10 11.8451 11.2875 9.54511 13.75 8.94455V8.30566C13.75 7.57733 14.2875 7.02789 15 7.02789C15.7125 7.02789 16.25 7.57733 16.25 8.30566V8.94455C18.7125 9.54511 20 11.8579 20 14.554V17.889L21.25 19.1668V20.4445Z'
        fill='#50CD89'
      />
    </svg>
  )
}
type NotificationProps = {
  date: string
  id: symbol
  link: string
  message: string
  priority: number
  status: number
  title: string
  userId: string
}
function NotificationsIcon(props: {className: string}) {
  const [show, setShow] = useState(false)
  const toggleDropdown = () => setShow(!show)
  const [notfications, setNotifications] = useState<NotificationProps[] | null>(null)
  const hasNotifications = !!notfications?.length
  useEffect(() => {
    getNotification().then((res) => {
      setNotifications(res.data)
    })
  }, [])

  return (
    <div className={props.className}>
      {/* <Dropdown show={show}>
        <div className='d-flex '>
          <div className='d-flex align-items-center position-relative'>
            <Dropdown.Toggle as={CustomToggle} onClick={toggleDropdown}>
              <div
                className='btn btn-icon btn-icon-muted btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px'
                onClick={toggleDropdown}
              >
                <span style={{position: 'absolute', top: '2px', left: '10px'}}>
                  {hasNotifications && <Bullet />}
                </span>
                <span className='svg-icon svg-icon-1'>
                  <NotificationBell className='' />
                </span>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu
              show={show}
              className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
            >
              <Dropdown.Header className='px-7 py-5'>
                <div className='fs-5 text-dark fw-bolder'>Notificações</div>
              </Dropdown.Header>

              <div className='separator border-gray-200'></div>
              <div className='px-5 py-5'>
                <div className='mb-10'>
                  <NotificationsList />
                </div>
              </div>
            </Dropdown.Menu>
          </div>
        </div>
      </Dropdown> */}
    </div>
  )
}

export function NotificationsList() {
  const [notfications, setNotifications] = useState<NotificationProps[] | null>(null)
  const hasNotifications = !!notfications?.length
  useEffect(() => {
    getNotification().then((res) => {
      setNotifications(res.data)
    })
  }, [])
  return (
    <div className='scroll-y'>
      {notfications?.map((o, index) => (
        <a key={index} href={o.link} className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
          <div className='d-flex flex-stack py-4'>
            <div className='d-flex align-items-center'>
              <div className='symbol symbol-35px me-4'>
                <span className={`symbol-label bg-${o.status}-primary`}>
                  <span className={`svg-icon svg-icon-2 svg-icon-${o.status}`}>
                    <BellIcon />
                  </span>
                </span>
              </div>
              <div className='mb-0 me-2'>
                <span>{o.title}</span>
                <div className='text-gray-400 fs-7'>{o.message}</div>
              </div>
            </div>
            <span className='badge badge-light fs-8'>
              {dayjs(dayjs.utc(o.date)).locale('pt-br').fromNow()}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

function NotificationBell(props: {className: string}) {
  return (
    <span className={props.className}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='30'
        height='30'
        viewBox='0 0 30 30'
        fill='none'
      >
        <path
          d='M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM15 23.125C13.9625 23.125 13.125 22.2875 13.125 21.25H16.875C16.875 22.2875 16.0375 23.125 15 23.125ZM21.25 20H8.75V18.75L10 17.5V14.2375C10 11.5875 11.2875 9.3375 13.75 8.75V8.125C13.75 7.4125 14.2875 6.875 15 6.875C15.7125 6.875 16.25 7.4125 16.25 8.125V8.75C18.7125 9.3375 20 11.6 20 14.2375V17.5L21.25 18.75V20Z'
          fill='white'
        />
      </svg>
    </span>
  )
}

function Bullet() {
  return (
    <span className='animation-blink'>
      <svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 6 6' fill='none'>
        <circle cx='3' cy='3' r='3' fill='#50CD89' />
      </svg>
    </span>
  )
}

export {Topbar}
