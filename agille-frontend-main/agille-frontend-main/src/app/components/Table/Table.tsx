import TableRow from '../../components/Table/TableRow'
import TableHead from '../../components/Table/TableHead'
import {TableHeadColumn} from '../../components/Table/TableHead'
import {TableRowProps} from '../../components/Table/TableRow'

export type TableProps = {
  headColumns: TableHeadColumn[];
  rows: TableRowProps[];
  className?: string;
}

export type TablePropsRows = {
  rows: TableRowProps[]
  sortOrder?: 'asc' | 'desc' | 'none';
  onMunicipioSortClick?: () => void;
  onResponsavelSortClick?: () => void;
}

export default function Table(props: TableProps) {
  return (
    <table className={`table align-middle gs-0 gy-4 ${props.className ?? ''}`}>
      <TableHead columns={props.headColumns || []} />
      {/* begin::Table body */}
      <tbody>
        {props.rows.map((row, index) => (
          <TableRow key={index} {...row} />
        ))}
      </tbody>
      {/* end::Table body */}
    </table>
  )
}
