import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {TableRowProps} from '../../../components/Table/TableRow'
import {mapContent} from '../../../components/Table/TableHead'
import {getJuridicalPerson, getJuridicalPersons} from '../../../services/JuridicalPersonApi'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import {pageLimit} from '../../../utils/constants'
import SearchFilter from '../../auth/components/SearchFilter'
import {TablePagination} from '../../auth/components/TablePagination'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import {formatCnpj} from '../../../utils/functions'

const TaxPayerTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['NOME', 'CNPJ', 'INSCRIÇÃO MUNICIPAL', 'TAXAS'])}
      rows={props.rows}
    />
  )
}

const UserTable: React.FC<{}> = () => {
  const [juridicalPersons, setJuridicalPersons] = useState<TableRowProps[]>([])
  const [itemsLength, setItemsLength] = useState(0)
  //TODO: Add type for user
  const [selectedJuridicalPerson, setSelectedJuridicalPerson] = React.useState<any>({})
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(true)

  const [juridicalPersonId, setJuridicalPersonId] = React.useState<string | null>(null)

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  useEffect(() => {
    if (juridicalPersonId) {
      getJuridicalPerson(juridicalPersonId).then(({data: user}) => {
        setSelectedJuridicalPerson({
          id: user.id,
          name: user.fullName,
          document: formatCnpj(user.document),
          emails: user.email,
          municipalRegistration: user.municipalRegistration,
          displayName: user.displayName,
          phones: user.phones,
        })
      })
    }
  }, [juridicalPersonId])
  useEffect(() => {
    setListIsLoading(true)

    getJuridicalPersons(selectedPage, pageLimit, true).then((juridicalPersons) => {
      setJuridicalPersons(
        juridicalPersons.data.map(
          (juridicalPerson: any): TableRowProps => ({
            columns: [
              juridicalPerson.name,
              formatCnpj(juridicalPerson.document),
              juridicalPerson.municipalRegistration,
            ].map((e) => ({content: e})),
            detailsColumn: [
              {
                content: 'Definir taxas',
                className: 'btn-primary',
                href: `/auditor/cadastros/consulta-operadoras/cadastro-taxas/${juridicalPerson.id}`,
                useRouterLink: true,
              },
            ],
          })
        )
      )
      setItemsLength(juridicalPersons.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, itemsLength])

  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Operadoras</span>
          </h3>
          <SearchFilter></SearchFilter>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              {juridicalPersons.length > 0 ? (
                <TaxPayerTable rows={juridicalPersons} />
              ) : (
                <EmptyStateList />
              )}
              {/* end::Table */}
            </div>
            {/* end::Table container */}
          </div>
        )}
        {!!juridicalPersons.length && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={itemsLength}
            maxPageItens={6}
          ></TablePagination>
        )}
      </div>
    </>
  )
}
export default function TaxPayerConsultPage() {
  return <UserTable></UserTable>
}
