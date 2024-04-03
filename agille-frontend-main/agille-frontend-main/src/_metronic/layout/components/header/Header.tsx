import React, {FC, useEffect} from 'react'
import {MenuInner, MenuInnerProps} from './MenuInner'
import {SwapperComponent} from '../../../assets/ts/components'

type HeaderProps = {
  inner: MenuInnerProps
}

const Header: FC<HeaderProps> = (props: HeaderProps) => {
  useEffect(() => {
    SwapperComponent.reinitialization()
  }, [])

  return (
    <div className='header-menu overflow-auto mx-4 ms-lg-10 mb-5 mb-lg-0' id='kt_header_menu'>
      <MenuInner {...props.inner} />
    </div>
  )
}

export {Header}
