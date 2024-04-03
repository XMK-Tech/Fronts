import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {getFilteredBackofficeUsers, getUser} from '../../../../services/UsersApi'
import {TablePagination} from '../../../auth/components/TablePagination'
import {CustomSearchFilter, useFilter} from '../../../auth/components/AdminSearchFilter'
import {pageLimit} from '../../../../utils/constants'
import EmptyStateList from '../../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../../utils/components/IsLoadingList'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import Table, {TablePropsRows} from '../../../../components/Table/Table'
import {mapContent} from '../../../../components/Table/TableHead'
import {TableRowProps} from '../../../../components/Table/TableRow'
import TableDetailsModal, {InfoCard} from '../../../../components/Table/TableDetailsModal'
import {checkHasText, formatCpf, formatDate} from '../../../../utils/functions'

const UserConsultTable: React.FC<TablePropsRows> = (props) => {
  return <Table headColumns={mapContent(['NOME', 'CPF', 'E-MAIL', 'DETALHES'])} rows={props.rows} />
}

const UserTable: React.FC<{}> = () => {
  const [users, setUsers] = useState<TableRowProps[]>([])
  //TODO: Add type for user
  const [itemsLength, setItemsLength] = useState<number>(0)
  const [selectedUser, setSelectedUser] = useState<any>({})
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(false)
  const franchiseId = useSelector<RootState>(
    (state) => state.auth.selectedFranchise,
    shallowEqual
  ) as string

  const modalCardInfo = [
    {item: 'Nome', description: checkHasText(selectedUser.name)},
    {item: 'CPF', description: checkHasText(selectedUser.document)},
    {item: 'E-mail', description: checkHasText(selectedUser.email)},
    {item: 'Endereço', description: checkHasText(selectedUser.street)},
    {item: 'Número', description: checkHasText(selectedUser.number)},
    {item: 'Município', description: checkHasText(selectedUser.city)},
    {item: 'Bairro', description: checkHasText(selectedUser.neighborhood)},
    {item: 'Celular', description: checkHasText(selectedUser.phone)},
    {item: 'Outro contato', description: checkHasText(selectedUser.secondaryPhoneNumber)},
  ]
  const [userId, setUserId] = React.useState<string | null>(null)
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  const showDetailsModal = !!userId

  const hideDetailsModal = () => setUserId(null)

  const filterConfig = useFilter([
    {value: 'userName', label: 'Nome'},
    {value: 'document', label: 'CPF'},
    {value: 'email', label: 'E-mail'},
  ])

  useEffect(() => {
    if (userId) {
      getUser(
        userId,
        pageLimit,
        selectedPage,
        filterConfig.searchText,
        filterConfig.selectedOption.value
      ).then(({data: user}) => {
        setSelectedUser({
          id: user.id,
          name: user.fullname,
          document: formatCpf(user.document),
          email: user.email,
          street: user?.address?.street,
          number: user?.address?.number,
          neighborhood: user?.address?.district,
          city: user?.address?.cityName,
          phone: user?.phoneNumber,
          secondaryPhoneNumber: user?.secondaryPhoneNumber,
          createdAt: formatDate(user.createdAt),
        })
      })
    }
  }, [userId, selectedPage, filterConfig.selectedOption.value, filterConfig.searchText])

  useEffect(() => {
    setListIsLoading(true)
    getFilteredBackofficeUsers(
      selectedPage,
      pageLimit,
      franchiseId,
      filterConfig.searchText,
      filterConfig.selectedOption.value
    ).then(({data: users, metadata: meta}) => {
      setUsers(
        users.map(
          (user: any): TableRowProps => ({
            columns: mapContent([user.fullName, formatCpf(user.document), user.email]),
            detailsColumn: [
              {
                content: 'Detalhes',
                className: 'btn-primary',
                buttonAction: () => {
                  setUserId(user.id)
                },
              },
            ],
          })
        )
      )
      setItemsLength(meta.dataSize)
      setListIsLoading(false)
    })
  }, [selectedPage, filterConfig.selectedOption.value, filterConfig.searchText])

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Usuários</span>
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
                <UserConsultTable rows={users} />
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
          imgUrl: toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg'),
          userInfo: modalCardInfo,
          linkUrl: `/backoffice/gerenciamento/cadastro-usuario/${selectedUser?.id || ''}`,
        }}
        infoCard={
          <InfoCard
            title={'Administrador'}
            subtitle={selectedUser.name}
            data={selectedUser.createdAt}
          />
        }
      />
    </>
  )
}

function UserConsult() {
  return <UserTable />
}

export default UserConsult
