import React from 'react'
import {NotificationsList} from '../../../_metronic/layout/components/header/Topbar'

export default function NotificationsPage() {
  return (
    <div className='card'>
      <div className='card-header border-0 pt-4'>
        <h3 className='card-title align-items-start flex-column'>Notificações</h3>
      </div>
      <div className='card-body pt-2'>
        <NotificationsList />
      </div>
    </div>
  )
}
