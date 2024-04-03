import {type} from 'os'
import React from 'react'
import {RegisterCheckboxInput} from '../../../../components/RegisterFormSwitch'
import {CheckListStatus, CheckListType} from '../../../services/CheckListApi'
type CheckLIstData = {
  label: string
  info: string
  status: number
}

type CheckListModelProps = {
  data: CheckLIstData[]
  onCheckedChange: (checked: boolean, i: number) => void
  checkedsItems: boolean[]

  onItemClick: (i: number) => void
  onInfoClick: (i: number) => void
}
export const getStatus = (status: CheckListStatus) => {
  switch (status) {
    case CheckListStatus.APROVED:
      return 'Aprovado'
    case CheckListStatus.PEDING:
      return 'Pendente'
    case CheckListStatus.REJECTED:
      return 'Reprovado'
    case CheckListStatus.SENT:
      return 'Enviado'
  }
}
export const getColor = (status: CheckListStatus) => {
  switch (status) {
    case CheckListStatus.APROVED:
      return 'success'
    case CheckListStatus.PEDING:
      return 'warning'
    case CheckListStatus.REJECTED:
      return 'danger'
    case CheckListStatus.SENT:
      return 'primary'
  }
}
export default function CheckListModel(props: CheckListModelProps) {
  return (
    <>
      {props.data.map((e, i) => (
        <div className='d-flex align-items-center mb-6 ms-8 justify-content-between'>
          <div className='d-flex align-items-center w-100'>
            <div className='d-flex flex-column flex-grow-1 py-2 '>
              <a
                href='#'
                className='text-dark-75 font-weight-bold text-hover-primary font-size-lg mb-1'
              >
                {e.label}
              </a>
              <a href='#' className='text-muted font-weight-bold text-hover-primary'>
                {e.info}
              </a>
            </div>
            {<CheckListStatusBadge status={e.status} />}
          </div>

          <ToggleIcon
            icon={<i className='fas fa-info-circle fs-4 p-0'></i>}
            onClick={() => props.onInfoClick(i)}
          ></ToggleIcon>
          <ToggleIcon
            icon={<i className='fas fa-upload  fs-2'></i>}
            onClick={() => props.onItemClick(i)}
          />
        </div>
      ))}
    </>
  )
}
type ToggleIconProps = {
  onClick: () => void
  icon: React.ReactNode
  iconColor?: string
}
type CheckListStatusBadgeProps = {
  status: number
}
export function CheckListStatusBadge(props: CheckListStatusBadgeProps) {
  return (
    <span className={`badge badge-light-${getColor(props.status)} me-10`}>
      {getStatus(props.status)}
    </span>
  )
}

export function ToggleIcon(props: ToggleIconProps) {
  return (
    <div>
      <span
        onClick={props.onClick}
        className={`btn btn-link btn-color-${
          props.iconColor || 'gray - 500'
        } btn-active-color-primary me-8 ms-8`}
      >
        {props.icon}
      </span>
    </div>
  )
}
