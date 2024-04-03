import React, {useEffect} from 'react'
import {Footer} from './components/Footer'
import {useMenuContext} from './components/header/HeaderWrapper'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {PageDataProvider, useLayout} from './core'
import {useLocation} from 'react-router-dom'
import {DrawerMessenger, ActivityDrawer, Main, InviteUsers, UpgradePlan} from '../partials'
import {MenuComponent} from '../../_metronic/assets/ts/components'
import clsx from 'clsx'
import AsideMenu from '../../app/components/AsideMenu/AsideMenu'

const MasterLayout: React.FC = ({children}) => {
  const {classes} = useLayout()

  const location = useLocation()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])
  const {width, expand, setExpand} = useMenuContext()
  return (
    <PageDataProvider>
      <div className='page d-flex flex-row flex-column-fluid'>
        <div
          style={{
            height: '100vh',
            overflowY: 'hidden',
          }}
          className='wrapper d-flex flex-row-fluid'
          id='kt_wrapper'
        >
          <AsideMenu expand={expand} onExpandChanged={setExpand} />
          <div
            style={{
              transition: 'margin-left 0.3s ease',
              boxSizing: 'border-box',
              height: '100vh',
              overflowY: 'scroll',
              marginLeft: '70px',
            }}
            className='d-flex flex-column justify-content-between w-100 '
          >
            <div id='kt_content' className='p-5 content d-flex flex-column //flex-column-fluid'>
              {/* <Toolbar /> */}
              <div
                className={clsx(
                  'd-flex flex-column-fluid align-items-start'
                  // classes.contentContainer.join(' ')
                )}
                id='kt_post'
              >
                <Content>{children}</Content>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>

      {/* begin:: Drawers */}
      <ActivityDrawer />

      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <Main />
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export {MasterLayout}
