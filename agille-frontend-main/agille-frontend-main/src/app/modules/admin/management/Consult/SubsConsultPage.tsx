import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {fakeEntities, getData, getFakeModalItemsByInterval} from '../../../../services/FakeApiData'
import {TablePagination} from '../../../auth/components/TablePagination'
import {AdminSearchFilter} from '../../../auth/components/AdminSearchFilter'
import {getFilteredFranchises} from '../../../../services/FranchisesApi'
import {pageLimit} from '../../../../utils/constants'
import IsLoadingList from '../../../../utils/components/IsLoadingList'
import EmptyStateList from '../../../../utils/components/EmptyStateList'
import Table, {TablePropsRows} from '../../../../components/Table/Table'
import {mapContent} from '../../../../components/Table/TableHead'
import {TableRowProps} from '../../../../components/Table/TableRow'
import TableDetailsModal from '../../../../components/Table/TableDetailsModal'

type SubsTableCardRowProps = {
  imgUrl: string
  prefeitura: string
  data: string
}

type SubsTableCardProps = {
  props: SubsTableCardRowProps[]
}

const SubsTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['NOME', 'CNPJ', 'MUNICÍPIO', 'E-MAIL', 'DETALHES'])}
      rows={props.rows}
    />
  )
}

export const SubsTableCardRow: React.FC<SubsTableCardRowProps> = (props) => {
  return (
    <tr className='text-center'>
      <td className='ps-5'>
        <img alt='Logo' src={props.imgUrl} className='h-40px' />{' '}
      </td>
      <td>
        <p className='text-dark fw-bolder d-block mb-1 fs-6'>{props.prefeitura}</p>
      </td>
      <td>
        <p className='text-dark fw-bolder d-block mb-1 fs-6'>{props.data}</p>
      </td>
    </tr>
  )
}
export const SubsTableCard: React.FC<SubsTableCardProps> = (props) => {
  return (
    <table className='table align-middle gs-0 gy-4'>
      <thead>
        <tr className=' fw-bolder text-muted justify-context-center'>
          <th className='text-center '></th>
          <th className='text-center '>Prefeitura</th>
          <th className='text-center'>Data</th>
        </tr>
      </thead>
      <tbody>
        {props.props.map((info, index) => (
          <SubsTableCardRow key={index} {...info} />
        ))}
      </tbody>
    </table>
  )
}
const SubsTableHead: React.FC<{}> = () => {
  return (
    <>
      {/* begin::Table head */}
      <thead>
        <tr className='fw-bolder text-muted bg-light justify-context-center'>
          <th className='rounded-start text-center '>NOME</th>
          <th className='text-center'>CNPJ</th>
          <th className='text-center'>MUNICÍPIO</th>
          <th className='text-center'>E-MAIL</th>
          <th className='text-center text-end rounded-end'>DETALHES</th>
        </tr>
      </thead>
      {/* end::Table head */}
    </>
  )
}

const UserTable: React.FC<{}> = () => {
  const [franchises, setFranchises] = useState<TableRowProps[]>([])
  const [modalList, setModalList] = useState<SubsTableCardRowProps[]>([])

  //TODO: Add type for user
  const [items, setItems] = useState<any[]>(getData('/api/v1/franchise'))
  const [modalItems, setModalItems] = useState<any[]>(getData('/api/v1/entities'))
  const [itemsLength, setItemsLength] = useState<number>(0)
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [modalSelectedPage, setModalSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(false)
  const modalCardInfo = [
    {item: 'Razão Social', description: selectedUser.name},
    {item: 'CNPJ', description: selectedUser.CNPJ},
    {item: 'Endereço', description: selectedUser.endereço},
    {item: 'Número', description: selectedUser.numero},
    {item: 'Município', description: selectedUser.Municipio},
    {item: 'Bairro', description: selectedUser.bairro},
    {item: 'Celular', description: selectedUser.celular},
    {item: 'Outro Contato', description: selectedUser.celular},
  ]
  const options = [
    {value: 'nome', label: 'Nome'},
    {value: 'CNPJ', label: 'CNPJ'},
    {value: 'Municipio', label: 'Município'},
    {value: 'Email', label: 'E-mail'},
  ]

  const [userId, setUserId] = React.useState<string | null>(null)

  const showDetailsModal = !!userId

  const hideDetailsModal = () => setUserId(null)

  useEffect(() => {
    setListIsLoading(true)
    getFilteredFranchises(selectedPage, pageLimit).then(({data: franchises, metadata: meta}) => {
      setFranchises(
        franchises.map(
          (franchise: any): TableRowProps => ({
            columns: mapContent([
              franchise.name,
              '81619596000104',
              'Belo Horizonte',
              'email@domain.com',
            ]),
            detailsColumn: [
              {
                content: 'Detalhes',
                className: 'btn-primary',
                buttonAction: () => {
                  setUserId(franchise.id)
                  setSelectedUser(franchise)
                },
              },
            ],
          })
        )
      )
      setItemsLength(meta.dataSize)
      setListIsLoading(false)
    })

    const modalEntities = getFakeModalItemsByInterval(modalSelectedPage, modalItems)
    setModalList(
      modalEntities.map(
        (entitie: any): SubsTableCardRowProps => ({
          imgUrl: toAbsoluteUrl('/media/illustrations/custom/logoCuritiba.svg'),
          prefeitura: entitie.Municipio,
          data: '03/01/2022',
        })
      )
    )
  }, [modalSelectedPage, selectedPage, items])

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  function onModalSelectedPageChanged(page: number) {
    setModalSelectedPage(page)
  }
  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Subsidiárias</span>
          </h3>
          <AdminSearchFilter
            options={options}
            search={setItems}
            path='/api/v1/franchise'
            setPage={setSelectedPage}
          ></AdminSearchFilter>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {/* begin::Table container */}
            {franchises.length > 0 ? (
              <div className='table-responsive h-450px'>
                {/* begin::Table */}
                <SubsTable rows={franchises} />
                {/* end::Table */}
              </div>
            ) : (
              <EmptyStateList />
            )}
            {/* end::Table container */}
          </div>
        )}
        {franchises.length > 0 && (
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
          imgUrl: toAbsoluteUrl('/media/illustrations/custom/logoAgille.png'),
          userInfo: modalCardInfo,
          linkUrl: `/admin/cadastro/subs/${selectedUser.id}`,
        }}
        infoCard={
          <div className='card shadow-sm w-500px '>
            <div className='p-5 d-flex flex-row justify-content-between'>
              <div className='p-3'>
                <h3>Prefeituras</h3>
                <p className='text-muted'>Total de Prefeituras: {fakeEntities.length}</p>
              </div>
            </div>
            <div className=' d-flex flex-column justify-content-between'>
              <SubsTableCard props={modalList} />
            </div>
            <TablePagination
              onSelectedPageChanged={onModalSelectedPageChanged}
              selectedPage={modalSelectedPage}
              arrayLength={fakeEntities.length}
              maxPageItens={4}
            ></TablePagination>
          </div>
        }
      />
    </>
  )
}

function SubsConsult() {
  return <UserTable />
}

export default SubsConsult
