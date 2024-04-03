import React from 'react'

export type OptionsProps = {
  item: string
  img: string
  notificationNumber: number
}

export const OptinsMenu: React.FC<OptionsProps> = (props) => {
  return (
    <div className='align-items-center d-flex shadow-sm w-240px h-40px bg-white'>
      <div>
        <img src={props.img} />
      </div>
      <div>{props.item}</div>
      <div>{props.notificationNumber}</div>
    </div>
  )
}

export default function DTEMainPage() {
  return (
    <div className='pb-10 d-flex flex-row justify-content-around card'>
      <div className='p-4 card shadow-sm w-300px bg-white'>
        <OptinsMenu img='' item='sdasdasdasd' notificationNumber={0}></OptinsMenu>
      </div>
      <div className='p-4 card shadow-sm w-700px bg-white'></div>
    </div>
  )
}
