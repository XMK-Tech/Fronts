import React, {useEffect, useState} from 'react'
import {getEntitie, getEntities} from '../../../../services/EntitiesApi'
import {TablePagination} from '../../../auth/components/TablePagination'
import {getData} from '../../../../services/FakeApiData'
import {CustomSearchFilter, useFilter} from '../../../auth/components/AdminSearchFilter'
import EmptyStateList from '../../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../../utils/components/IsLoadingList'
import {pageLimit} from '../../../../utils/constants'
import Table, {TablePropsRows} from '../../../../components/Table/Table'
import {mapContent} from '../../../../components/Table/TableHead'
import {TableRowProps} from '../../../../components/Table/TableRow'
import TableDetailsModal, {InfoCard} from '../../../../components/Table/TableDetailsModal'
import {formatCnpj, formatDate} from '../../../../utils/functions'

const CountyTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['MUNICÍPIO', 'CNPJ', 'RUA', 'NÚMERO', 'DETALHES'])}
      rows={props.rows}
    />
  )
}

const UserTable: React.FC<{}> = () => {
  const [users, setUsers] = useState<TableRowProps[]>([])

  const [items, setItems] = useState<any[]>(getData('/api/v1/entities'))
  const [itemsLength, setItemsLength] = useState<number>(0)
  const [selectedCountyData, setSelectedCountyData] = React.useState<any>(null)
  const [listIsLoading, setListIsLoading] = useState(true)

  const selectedCounty = {
    id: selectedCountyData?.id,
    name: selectedCountyData?.name,
    document: formatCnpj(selectedCountyData?.document),
    municipalRegistration: selectedCountyData?.municipalRegistration,
    displayName: selectedCountyData?.displayName,
    phones: selectedCountyData?.phones,
    entityImage: selectedCountyData?.entityImage,
    phone: selectedCountyData?.phone,
    address: {
      cityName: selectedCountyData?.address?.cityName,
      stateName: selectedCountyData?.address?.stateName,
      zipcode: selectedCountyData?.address?.zipcode,
      street: selectedCountyData?.address?.street,
      number: selectedCountyData?.address?.number,
      district: selectedCountyData?.address?.district,
    },
  }
  const modalCardInfo = [
    {item: 'Nome', description: selectedCounty.name},
    {item: 'CNPJ', description: selectedCounty.document},
    {item: 'CEP', description: selectedCounty.address?.zipcode},
    {item: 'Cidade', description: selectedCounty.address?.cityName},
    {item: 'Endereço', description: selectedCounty.address?.street},
    {item: 'Número', description: selectedCounty.address?.number},
    {item: 'Bairro', description: selectedCounty.address?.district},
  ]

  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [countyId, setCountyId] = React.useState<string | null>(null)

  const showDetailsModal = !!countyId

  const hideDetailsModal = () => setCountyId(null)

  useEffect(() => {
    if (countyId) {
      getEntitie(countyId).then(({data: county}) => {
        setSelectedCountyData(county)
      })
    }
  }, [countyId])
  const filterConfig = useFilter([
    {value: 'County', label: 'Município'},
    {value: 'Document', label: 'CNPJ'},
    {value: 'Street', label: 'Rua'},
    {value: 'Number', label: 'Número'},
  ])

  useEffect(() => {
    setListIsLoading(true)
    getEntities(
      selectedPage,
      pageLimit,
      filterConfig.searchText,
      filterConfig.selectedOption?.value
    ).then(({data: county, metadata: meta}) => {
      setUsers(
        county.map(
          (item: any): TableRowProps => ({
            columns: mapContent([
              item.name,
              formatCnpj(item.document),
              item.address?.street,
              item.address?.number,
            ]),
            detailsColumn: [
              {
                content: 'Detalhes',
                className: 'btn-primary',
                buttonAction: () => {
                  setCountyId(item.id)
                },
              },
            ],
          })
        )
      )
      setItemsLength(meta.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, items, filterConfig.searchText, filterConfig.selectedOption?.value])

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Municípios</span>
          </h3>
          <div>
            <CustomSearchFilter {...filterConfig} />
          </div>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {users.length > 0 ? (
              <div className='table-responsive h-450px'>
                <CountyTable rows={users} />
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {users.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={itemsLength}
            maxPageItens={pageLimit}
          ></TablePagination>
        )}
      </div>
      <TableDetailsModal
        size={'xl'}
        show={showDetailsModal}
        onHide={hideDetailsModal}
        title='DETALHES'
        detailsCard={{
          imgUrl: selectedCounty?.entityImage,
          userInfo: modalCardInfo,
          linkUrl: `/backoffice/gerenciamento/cadastro-municipio/${selectedCounty.id}`,
        }}
        infoCard={
          <InfoCard
            title={'Municipio'}
            subtitle={selectedCounty.address?.cityName}
            data={formatDate(selectedCountyData?.responsible?.createdAt)}
          />
        }
      />
    </>
  )
}

function CountyConsult() {
  return <UserTable />
}

export default CountyConsult
