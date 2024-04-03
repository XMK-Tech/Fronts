import React, {useEffect, useState} from 'react'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {TableRowProps} from '../../components/Table/TableRow'
import {
  approveImportReplacement,
  getImports,
  rejectImportReplacement,
} from '../../services/ImportsApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import ModeloModal, {ModalErrorFooter} from '../../utils/components/ModeloModal'
import {pageLimit} from '../../utils/constants'
import {getDate} from '../../utils/functions'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {TablePagination} from '../auth/components/TablePagination'
import {ImportApiStatus} from '../backoffice/ImportsPage'
import {ToggleIcon} from '../ITR/Components/CheckLIstModel'
import InfoModel from '../ITR/Components/InfoModel'

const ImportsTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent([
        'DOCUMENTO',
        'ARQUIVO',
        'TIPO',
        'DATA',
        'STATUS',
        'INFORMAÇÕES',
        'AÇÕES',
      ])}
      rows={props.rows}
    />
  )
}

type ImportStatus =
  | 'EM ANDAMENTO'
  | 'CONCLUÍDO'
  | 'CONFLITO'
  | 'SUBSTITUÍDO'
  | 'CONCLUÍDO'
  | 'REPROVADO'
function getColorByStatus(status: ImportStatus, returnColorName?: boolean): string | undefined {
  if (status === 'CONCLUÍDO') {
    return returnColorName ? 'success' : 'badge-light-success'
  }
  if (status === 'EM ANDAMENTO') {
    return returnColorName ? 'primary' : 'badge-light-primary'
  }

  if (status === 'SUBSTITUÍDO') {
    return returnColorName ? 'info' : 'badge-light-info'
  }
  if (status === 'CONFLITO') {
    return returnColorName ? 'warning' : 'badge-light-warning'
  }
  if (status === 'REPROVADO') {
    return returnColorName ? 'dark' : 'badge-light-dark'
  }
}
function getMessageByStatus(status: ImportStatus): string | undefined {
  if (status === 'CONCLUÍDO') {
    return 'Status Concluído , a sua importação foi realizada com sucesso'
  }
  if (status === 'EM ANDAMENTO') {
    return 'Status Em Andamento , a sua importação está sendo realizada e pode demorar entre 1 a 2 dias para ser concluída'
  }

  if (status === 'SUBSTITUÍDO') {
    return 'Status Substituído , a sua importação foi substituída por outra importação'
  }
  if (status === 'CONFLITO') {
    return 'Status Conflito , o mesmo documento foi importado mais de uma vez, você pode aprovar ou rejeitar a importação do novo documento'
  }
  if (status === 'REPROVADO') {
    return 'Status Reprovado , a substituição do documento foi reprovada'
  }
}

const UserTable: React.FC<{}> = () => {
  const [statusImports, setStatusImports] = useState<TableRowProps[]>([])
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [statusImportsLenght, setStatusImportsLenght] = useState<number>(0)
  const [listIsLoading, setListIsLoading] = useState(true)
  const [error, setError] = useState<{message: any} | null>(null)
  const [statusImportId, setStatusImportId] = useState<string | null>(null)
  const [showModalReplacement, setShowModalReplacement] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [loadingConfirmedButton, setLoadingComfimedButton] = useState(false)
  const [loadinCanceledButton, setLoadinCanceledButton] = useState(false)
  const [statusName, setStatusName] = useState<ImportStatus | null>(null)

  function getStatus(apiStatus: ImportApiStatus): ImportStatus {
    switch (apiStatus) {
      case ImportApiStatus.Done:
        return 'CONCLUÍDO'
      case ImportApiStatus.DeniedForDuplicity:
        return 'REPROVADO'
      case ImportApiStatus.WaitingForReplacementValidation:
        return 'CONFLITO'
      case ImportApiStatus.ApprovedReplacement:
        return 'CONCLUÍDO'
      case ImportApiStatus.Replaced:
        return 'SUBSTITUÍDO'
      default:
        return 'EM ANDAMENTO'
    }
  }

  const filterConfig = useFilter([
    {
      options: [
        {value: 'Processing', label: 'Em andamento'},
        {value: 'Done', label: 'Concluído'},
        {value: 'DeniedForDuplicity', label: 'Reprovado'},
        {value: 'WaitingForReplacementValidation', label: 'Conflito'},
        {value: 'ApprovedReplacement', label: 'Concluído'},
        {value: 'Replaced', label: 'Substituído'},
      ],
      label: 'Status',
      value: 'Status',
      type: 'select',
    },
  ])
  function refreshList() {
    getImports(
      selectedPage,
      pageLimit,
      filterConfig.searchText,
      filterConfig.selectedOption.value
    ).then((imports) => {
      setStatusImports(
        imports.data.map(
          //TODO: add type
          (importItem: any): TableRowProps => {
            const status = getStatus(importItem.status)
            const colorClassName = getColorByStatus(status)

            return {
              columns: mapContent([
                importItem.type === 1 ? 'FISCAL' : 'TRANSAÇÃO',
                importItem?.attachment?.displayName,
                importItem.isSimplified ? 'SIMPLIFICADO' : 'CONSOLIDADO',
                getDate(importItem.createdAt),
                <span className={`mw-150px text-wrap badge ${colorClassName} fw-bolder`}>
                  {status}
                </span>,
                <ToggleIcon
                  icon={<i className='fas fa-info-circle fs-4 p-0'></i>}
                  onClick={() => {
                    setStatusImportId(importItem.id)
                    setStatusName(status)
                    setShowModalInfo(true)
                  }}
                ></ToggleIcon>,
              ]),
              detailsColumn: [
                {
                  content: 'Substituir',
                  className:
                    importItem.status === ImportApiStatus.WaitingForReplacementValidation
                      ? ' me-2'
                      : 'btn-light me-2 disabled',
                  buttonAction: () => {
                    setShowModalReplacement(true)
                    setStatusImportId(importItem.id)
                  },
                },
              ],
            }
          }
        )
      )
      setStatusImportsLenght(imports.metadata.dataSize)
      setListIsLoading(false)
    })
  }
  useEffect(() => {
    setListIsLoading(true)
    refreshList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage, filterConfig.selectedOption.value, filterConfig.searchText])
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  async function onReplacementConfirmed(id: string) {
    setLoadingComfimedButton(true)
    try {
      await approveImportReplacement(id)
      setShowModalReplacement(false)
      refreshList()
    } catch (error) {
      setError({message: error})
    } finally {
      setLoadingComfimedButton(false)
    }
  }
  async function onReplacementCanceled(id: string) {
    setLoadinCanceledButton(true)
    try {
      await rejectImportReplacement(id)
      setShowModalReplacement(false)
      refreshList()
    } catch (error) {
      setError({message: error})
    } finally {
      setLoadinCanceledButton(false)
    }
  }
  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Importações</span>
          </h3>
          <div>
            <CustomSearchFilter {...filterConfig} />
          </div>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body p-5'>
            <div className='table-responsive'>
              {statusImports.length > 0 ? (
                <ImportsTable rows={statusImports} />
              ) : (
                <EmptyStateList />
              )}
            </div>
          </div>
        )}

        {statusImports.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={statusImportsLenght}
            maxPageItens={pageLimit}
          ></TablePagination>
        )}
        <ModeloModal
          title={'Informações do Staus'}
          show={showModalInfo}
          onHide={() => setShowModalInfo(false)}
          body={
            <InfoModel
              title={statusName || ''}
              infoColor={getColorByStatus(statusName as ImportStatus, true)}
              message={getMessageByStatus(statusName as ImportStatus) || ''}
            />
          }
        />
        <ModeloModal
          show={showModalReplacement}
          title={'Substituir'}
          onHide={() => setShowModalReplacement(false)}
          body={
            <InfoModel
              title='Deseja subistituir o arquivo ? '
              message={
                'Se você aprovar, o arquivo atual será substituído, caso contrário, o arquivo atual será mantido, caso não queira realizar nehuma das ações clique em fechar.'
              }
              infoColor='info'
              button={[
                {
                  label: 'Reprovar',
                  onClick: () => onReplacementCanceled(statusImportId || ''),
                  type: 'outline',
                  loading: loadinCanceledButton,
                },
                {
                  label: 'Aprovar',
                  onClick: () => onReplacementConfirmed(statusImportId || ''),
                  loading: loadingConfirmedButton,
                },
              ]}
            />
          }
          footer={<ModalErrorFooter modalFooter={<></>} error={error} />}
        />
      </div>
    </>
  )
}
export default function AuditorImportStatusPage() {
  return (
    <>
      <UserTable />
    </>
  )
}
