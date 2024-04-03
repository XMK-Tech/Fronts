import {ReactNode} from 'react'

export type TableHeadColumn = {
  content: ReactNode,
  sortable?: Boolean,
  className?: string
}

type TableHeadProps = {
  columns: TableHeadColumn[]
}

export default function TableHead(props: TableHeadProps) {
  function getClassName(className: string | undefined, index: number): string | undefined {
    return `${className || ''} ${index === 0 ? 'rounded-start' : ''} text-center ${
      index === props.columns.length - 1 ? 'rounded-end' : ''
    }`
  }
  return (
    <thead>
      <tr className='fw-bolder text-muted bg-light fs-8 justify-context-center'>
        {props.columns.map((field, index) => (
          <th key={index} className={getClassName(field.className, index)}>
           {field.sortable 
              ? <button type="button" /* onClick={() => setSortedField(field.content)} */ />
              : field.content
           }
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function mapContent(texts: ReactNode[], fontWeight: string = 'bolder'): TableHeadColumn[] {
  return texts.map((e) => ({content: e, fontWeight: fontWeight}))
}
