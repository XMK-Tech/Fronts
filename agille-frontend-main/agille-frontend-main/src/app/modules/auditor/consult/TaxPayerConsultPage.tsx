import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {TableRowProps} from '../../../components/Table/TableRow'
import {mapContent} from '../../../components/Table/TableHead'
import {getJuridicalPerson, getJuridicalPersons} from '../../../services/JuridicalPersonApi'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'
import {pageLimit} from '../../../utils/constants'
import {TablePagination} from '../../auth/components/TablePagination'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import TableDetailsModal, {InfoCard} from '../../../components/Table/TableDetailsModal'
import {CustomSearchFilter, useFilter} from '../../auth/components/AdminSearchFilter'
import {formatCnpj, formatDate} from '../../../utils/functions'

const TaxPayerTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['NOME', 'CNPJ', 'INSCRIÇÃO MUNICIPAL', 'DETALHES'])}
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

  const modalCardInfo = [
    {item: 'Nome', description: selectedJuridicalPerson.name},
    {item: 'CNPJ', description: formatCnpj(selectedJuridicalPerson.document)},
    {item: 'Inscrição Municipal', description: selectedJuridicalPerson.municipalRegistration},
    {
      item: 'Rua',
      description:
        selectedJuridicalPerson.addresses && selectedJuridicalPerson.addresses.length > 0
          ? selectedJuridicalPerson.addresses[0].street
          : '',
    },
    {
      item: 'Número',
      description:
        selectedJuridicalPerson.addresses && selectedJuridicalPerson.addresses.length > 0
          ? selectedJuridicalPerson.addresses[0].number
          : '',
    },
    {
      item: 'Município',
      description:
        selectedJuridicalPerson.addresses && selectedJuridicalPerson.addresses.length > 0
          ? selectedJuridicalPerson.addresses[0].cityName
          : '',
    },
    {
      item: 'Bairro',
      description:
        selectedJuridicalPerson.addresses && selectedJuridicalPerson.addresses.length > 0
          ? selectedJuridicalPerson.addresses[0].district
          : '',
    },
    {
      item: 'UF',
      description:
        selectedJuridicalPerson.addresses && selectedJuridicalPerson.addresses.length > 0
          ? selectedJuridicalPerson.addresses[0].stateName
          : '',
    },
    {
      item: 'CEP',
      description:
        selectedJuridicalPerson.addresses && selectedJuridicalPerson.addresses.length > 0
          ? selectedJuridicalPerson.addresses[0].zipcode
          : '',
    },
  ]
  const [juridicalPersonId, setJuridicalPersonId] = React.useState<string | null>(null)

  const showDetailsModal = !!juridicalPersonId

  const hideDetailsModal = () => setJuridicalPersonId(null)

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const filterConfig = useFilter([
    {value: 'Document', label: 'CPF/ CNPJ'},
    {value: 'Name', label: 'Nome/ Razão Social'},
    {value: 'DisplayName', label: 'Apelido/ Nome Fantasia'},
  ])
  useEffect(() => {
    if (juridicalPersonId) {
      getJuridicalPerson(juridicalPersonId).then(({data: user}) => {
        setSelectedJuridicalPerson({
          id: user.id,
          name: user.name,
          document: formatCnpj(user.document),
          emails: user.email,
          municipalRegistration: user.municipalRegistration,
          displayName: user.displayName,
          addresses: user.addresses,
          phones: user.phones,
          date: user.date,
          createdAt: formatDate(user.createdAt),
        })
      })
    }
  }, [juridicalPersonId])
  useEffect(() => {
    setListIsLoading(true)

    getJuridicalPersons(
      selectedPage,
      pageLimit,
      false,
      filterConfig.searchText,
      filterConfig.selectedOption.value
    ).then((juridicalPersons) => {
      setJuridicalPersons(
        juridicalPersons.data.map(
          (juridicalPerson: any): TableRowProps => ({
            columns: mapContent([
              juridicalPerson.name,
              formatCnpj(juridicalPerson.document),
              juridicalPerson.municipalRegistration,
            ]),
            detailsColumn: [
              {
                content: 'Detalhes',
                className: 'btn-primary',
                buttonAction: () => {
                  setJuridicalPersonId(juridicalPerson.id)
                },
              },
            ],
          })
        )
      )
      setItemsLength(juridicalPersons.metadata.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, itemsLength, filterConfig.selectedOption.value, filterConfig.searchText])

  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Contribuintes</span>
          </h3>
          <div>
            <CustomSearchFilter {...filterConfig} />
          </div>
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
      <TableDetailsModal
        size={'xl'}
        show={showDetailsModal}
        onHide={hideDetailsModal}
        title='DETALHES'
        detailsCard={{
          imgUrl: toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg'),
          userInfo: modalCardInfo,
          linkUrl: `/auditor/cadastros/cadastro-contribuintes/${selectedJuridicalPerson.id}`,
        }}
        infoCard={
          <InfoCard
            title={'Contribuinte'}
            subtitle={selectedJuridicalPerson.name}
            data={selectedJuridicalPerson?.createdAt}
          />
        }
      />
    </>
  )
}
export default function TaxPayerConsultPage() {
  return <UserTable></UserTable>
}
