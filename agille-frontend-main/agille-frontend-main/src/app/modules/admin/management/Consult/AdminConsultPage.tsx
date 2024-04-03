import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {getFilteredAdmins} from '../../../../services/UsersApi'
import {TablePagination} from '../../../auth/components/TablePagination'

import {AdminSearchFilter} from '../../../auth/components/AdminSearchFilter'
import {pageLimit} from '../../../../utils/constants'
import IsLoadingList from '../../../../utils/components/IsLoadingList'
import EmptyStateList from '../../../../utils/components/EmptyStateList'
import {mapContent} from '../../../../components/Table/TableHead'
import Table, {TablePropsRows} from '../../../../components/Table/Table'
import {TableRowProps} from '../../../../components/Table/TableRow'
import TableDetailsModal, {InfoCard} from '../../../../components/Table/TableDetailsModal'
import {formatCpf} from '../../../../utils/functions'

const AdminTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent(['NOME', 'CPF', 'MUNICÍPIO', 'E-MAIL', 'DETALHES'])}
      rows={props.rows}
    />
  )
}

const UserTable: React.FC<{}> = () => {
  const [users, setUsers] = useState<TableRowProps[]>([])
  //TODO: Add type for user
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [items, setItems] = useState<any[]>([])
  const [itemsLength, setItemsLength] = useState<number>(0)
  const [listIsLoading, setListIsLoading] = useState(false)

  const modalCardInfo = [
    {item: 'Nome', description: selectedUser.fullName},
    {item: 'CPF', description: selectedUser.document},
    {item: 'E-mail', description: selectedUser.email},
    {item: 'Endereço', description: selectedUser.endereço},
    {item: 'Número', description: selectedUser.numero},
    {item: 'Município', description: selectedUser.Municipio},
    {item: 'Bairro', description: selectedUser.bairro},
    {item: 'Celular', description: selectedUser.phoneNumber},
  ]
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const [userId, setUserId] = React.useState<string | null>(null)

  const showDetailsModal = !!userId

  const hideDetailsModal = () => setUserId(null)

  const options = [
    {value: 'nome', label: 'Nome'},
    {value: 'CPF', label: 'CPF'},
    {value: 'Email', label: 'E-mail'},
  ]
  useEffect(() => {
    setListIsLoading(true)
    getFilteredAdmins(selectedPage, pageLimit, true).then(({data: users, metadata: meta}) => {
      setUsers(
        users.map(
          (user: any): TableRowProps => ({
            columns: mapContent([
              user.fullName,
              formatCpf(user.document),
              user.phoneNumber,
              user.email,
            ]),
            detailsColumn: [
              {
                content: 'Detalhes',
                className: 'btn-primary',
                buttonAction: () => {
                  setUserId(user.id)
                  setSelectedUser(user)
                },
              },
            ],
          })
        )
      )
      setItemsLength(meta.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, items])
  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Administradores</span>
          </h3>
          <AdminSearchFilter
            options={options}
            path='/api/v1/user'
            type='Admin'
            search={setItems}
            setPage={setSelectedPage}
          ></AdminSearchFilter>
        </div>
        {/* end::Header */}
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {/* begin::Table container */}
            {users.length > 0 ? (
              <div className='table-responsive'>
                {/* begin::Table */}
                <AdminTable rows={users} />
                {/* end::Table */}
              </div>
            ) : (
              <EmptyStateList />
            )}
            {/* end::Table container */}
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
          imgUrl: toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg'),
          userInfo: modalCardInfo,
          linkUrl: `/admin/cadastro/admin/${selectedUser?.id || ''}`,
        }}
        infoCard={
          <InfoCard title={'Administrador'} subtitle={selectedUser.fullName} data={'03/01/2022'} />
        }
      />
    </>
  )
}

function AdminConsult() {
  return <UserTable />
}

export default AdminConsult
