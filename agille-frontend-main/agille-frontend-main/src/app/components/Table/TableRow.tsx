import React, {ReactNode} from 'react'
import {Link} from 'react-router-dom'
import DropButtonModel, {dropItemsProps} from '../../utils/components/DropButtonModel'

export type TableRowProps = {
  columns: {
    fontWeight?: 'bolder' | 'bold' | 'normal'
    content: ReactNode
    className?: string
  }[]
  detailsColumn?: {
    dropButton?: boolean
    dropItems?: dropItemsProps[]
    content: ReactNode
    className?: string
    dataToggle?: string
    dataTarget?: string
    buttonAction?: () => void
    href?: string
    useRouterLink?: boolean
    isLoading?: boolean
  }[]
  className?: string
}

export default function TableRow(props: TableRowProps) {
  return (
    <tr className={`text-center ${props.className || ''}`}>
      {props.columns.map((field, index) => (
        <td
          key={index}
          className={`fs-8 fw-${field.fontWeight ?? ''}  mb-1 fs-6 ${field.className || ''}`}
        >
          {field.content}
        </td>
      ))}
      {props.detailsColumn ? (
        <td className='d-flex flex-row justify-content-center'>
          {props.detailsColumn.map((field, index) => {
            const props = {
              key: index,
              onClick: () => {
                field.buttonAction && field.buttonAction()
              },
              className: `${field.className || ''} btn btn-primary btn-sm px-3 `,
            }
            if (!field.useRouterLink) {
              return (
                <>
                  {field.dropButton ? (
                    <DropButtonModel
                      dropItems={field.dropItems ?? []}
                      title={field.content}
                    ></DropButtonModel>
                  ) : (
                    <a
                      href={field.href}
                      data-bs-toggle={field.dataToggle}
                      data-bs-target={field.dataTarget}
                      target={'_self'}
                      {...props}
                    >
                      {field.content}
                      {field.isLoading && (
                        <span className=' ms-2 spinner-border spinner-border-sm'></span>
                      )}
                    </a>
                  )}
                </>
              )
            }
            return (
              <Link to={field.href as string} {...props}>
                {field.content}
              </Link>
            )
          })}
        </td>
      ) : null}
    </tr>
  )
}
// else if (field.dropButton === true) {
//   return (
//     <DropButtonModel
//       dropItems={field.dropItems ?? []}
//       title={field.content}
//     ></DropButtonModel>
//   )
// }
