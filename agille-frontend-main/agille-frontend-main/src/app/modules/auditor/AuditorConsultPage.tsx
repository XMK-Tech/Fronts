import React, {useEffect, useState} from 'react'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../setup/redux/RootReducer'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {getAudit, getAuditAccess, getAuditores} from '../../services/UsersApi'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {pageLimit} from '../../utils/constants'
import {getUser} from '../../services/UsersApi'
import SearchFilter from '../auth/components/SearchFilter'
import {TablePagination} from '../auth/components/TablePagination'
import {TableRowProps} from '../../components/Table/TableRow'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import TableDetailsModal, {InfoCard} from '../../components/Table/TableDetailsModal'
import {formatCpf, formatDate} from '../../utils/functions'
import {useSelectedModule} from '../../../setup/redux/hooks'
import {Module} from '../auth/redux/AuthTypes'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {CustomButton} from '../../components/CustomButton/CustomButton'

const AuditorsTable: React.FC<TablePropsRows> = (props) => {
  return <Table headColumns={mapContent(['NOME', 'CPF', 'E-MAIL', 'DETALHES'])} rows={props.rows} />
}

const UserTable: React.FC<{}> = () => {
  const entityId = useSelector<RootState>(({auth}) => auth.selectedEntity, shallowEqual) as string
  const filterConfig = useFilter([
    {
      value: 'document',
      label: 'CPF',
    },
    {
      value: 'email',
      label: 'E-mail',
    },
    {
      value: 'userName',
      label: 'Nome',
    },
  ])
  const [users, setUsers] = useState<TableRowProps[]>([])
  const [itemsLength, setItemsLength] = useState(0)
  //TODO: Add type for user
  const [selectedUser, setSelectedUser] = React.useState<any>({})
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(true)

  const modalCardInfo = [
    {item: 'Nome', description: selectedUser.name},
    {item: 'CPF', description: formatCpf(selectedUser.document)},
    {item: 'E-mail', description: selectedUser.email},
    {item: 'Endereço', description: selectedUser.address ? selectedUser.address.street : ''},
    {item: 'Número', description: selectedUser.address ? selectedUser.address.complement : ''},
    {item: 'Município', description: selectedUser.address ? selectedUser.address.street : ''},
    {item: 'Bairro', description: selectedUser.address ? selectedUser.address.district : ''},
    {item: 'Celular', description: selectedUser.phone},
  ]

  const [userId, setUserId] = React.useState<string | null>(null)
  const showDetailsModal = !!userId

  const hideDetailsModal = () => setUserId(null)

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  useEffect(() => {
    if (userId) {
      getUser(userId, 6).then(({data: user}) => {
        setSelectedUser({
          id: user.id,
          name: user.fullname,
          document: formatCpf(user.document),
          email: user.email,
          phone: user.phoneNumber,
          address: user.address,
          createdAt: user.createdAt,
          permissions: user.permissions,
        })
      })
    }
  }, [userId])
  useEffect(() => {
    setListIsLoading(true)

    getAuditores(
      selectedPage,
      pageLimit,
      entityId,
      filterConfig.searchText,
      filterConfig.selectedOption?.value
    ).then(({data: users, metadata: meta}) => {
      setUsers(
        users.map(
          (user: any): TableRowProps => ({
            columns: [user.fullName, formatCpf(user.document), user.email].map((e) => ({
              content: e,
            })),
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
  }, [selectedPage, entityId, filterConfig.searchText, filterConfig.selectedOption?.value])
  const module = useSelectedModule()

  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Auditores</span>
          </h3>
          <CustomSearchFilter {...filterConfig}></CustomSearchFilter>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {/* begin::Table container */}
            {users.length > 0 ? (
              <div className='table-responsive h-450px'>
                {/* begin::Table */}
                <AuditorsTable rows={users} />
                {/* end::Table */}
              </div>
            ) : (
              <div className='card-body d-flex flex-column justify-content-center rounded ms-4  text-center w-100'>
                <p className='fw-bolder fs-6'>
                  Não foram encontrados resultados para a pesquisa.<br></br> Por favor, tente
                  novamente usando outro termo.
                </p>
                <label className='form-label' placeholder='Digite o valor padrão'></label>

                <img
                  alt='Logo'
                  src={toAbsoluteUrl('/media/illustrations/custom/emptySheet.svg')}
                  className='img-fluid mh-250px'
                />
              </div>
            )}
            {/* end::Table container */}
          </div>
        )}
        {users.length > 0 && (
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
          linkUrl: `${
            module == Module.Auditor
              ? `/auditor/administrativo/cadastro-auditor/${selectedUser.id}`
              : `/ITR/RegisterAuditor/${selectedUser.id}`
          }`,
        }}
        infoCard={
          <InfoCard
            title={'AUDITOR'}
            subtitle={selectedUser.name}
            data={formatDate(selectedUser?.createdAt)}
            butons={[
              {
                label: 'Logs de Auditoria',
                onClick: () => {
                  getAudit(userId || '')
                },
                isLoading: false,
              },
              {
                label: 'Logs de Acesso',
                onClick: () => {
                  getAuditAccess(userId || '')
                },
                isLoading: false,
              },
            ]}
          />
        }
      />
    </>
  )
}

function AuditorConsult() {
  return <UserTable />
}

export default AuditorConsult
