import React, {useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import Table, {TablePropsRows} from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import {TableRowProps} from '../../../components/Table/TableRow'
import {
  FiscalProcedure,
  getFilteredFiscalProcedures,
  getFiscalProcedure,
  ProcedureStatus,
} from '../../../services/FiscalProcedureApi'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import IsLoadingList from '../../../utils/components/IsLoadingList'

import {pageLimit} from '../../../utils/constants'
import {getDate} from '../../../utils/functions'
import {CustomSearchFilter, FilterOptions, useFilter} from '../../auth/components/AdminSearchFilter'
import {getParameterLabel, parametersData} from './getParameterLabel'
import {FormSwitch} from '../../../components/Form/FormSwitch'
import {RegisterCheckboxInput} from '../../../../components/RegisterFormSwitch'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import ModeloModal from '../../../utils/components/ModeloModal'
import {exportProcedures} from './exportProcedure'
import InfoModel from '../Components/InfoModel'
import {EntitiesType, getEntitie, getEntitiesAgille} from '../../../services/EntitiesApi'
import {TablePagination} from '../../auth/components/TablePagination'
import ITRModalHerds from '../Components/ITRModalHerds'

const columns = [
  'CIB',
  'PROPRIEDADE',
  'ANO',
  'PARÂMETRO',
  'NÚMERO DO PROCESSO',
  'DATA DE CRIAÇÃO',
  'STATUS',
  'AÇÕES',
]
const FiscalProcedureConsultTable: React.FC<
  TablePropsRows & {
    allSelected: boolean
    onAllSelected: (value: boolean) => void
  }
> = (props) => {
  return (
    <Table
      headColumns={[
        {
          content: (
            <RegisterCheckboxInput
              checked={props.allSelected}
              onCheckedChange={props.onAllSelected}
            />
          ),
        },
        ...mapContent(columns),
      ]}
      rows={props.rows}
    />
  )
}

function getParamTypes(paramTypes: number[]) {
  return paramTypes
    .map((paramType) => {
      return getParameterLabel(paramType)
    })
    .filter(Boolean)
    .join(', ')
}

function getStatus(paramType: number) {
  switch (paramType) {
    case 1:
      return 'Não iniciado'
    case 2:
      return 'Em progresso'
    case 3:
      return 'Terminado'
    default:
      return 'Null'
  }
}

function getStatusColor(paramType: number) {
  switch (paramType) {
    case 1:
      return 'danger'
    case 2:
      return 'warning'
    case 3:
      return 'success'
    default:
      return 'danger'
  }
}

function FiscalProcedureStatus(props: {procedure: FiscalProcedure}) {
  const {procedure} = props
  return (
    <span className={`badge badge-light-${getStatusColor(procedure.status)}`}>
      {getStatus(procedure.status)}
    </span>
  )
}

const FiscalProcedureTable: React.FC<{}> = () => {
  const [itemsLength, setItemsLength] = useState<number>(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(false)
  const [dteModalIsVisible, setDteModalIsVisible] = useState(false)
  const [DTEModalError, setDTEModalError] = useState(false)
  const [loadingDTE, setLoadingDTE] = useState(false)
  const options: FilterOptions[] = [
    {value: 'cibNumber', label: 'CIB'},
    {
      value: 'status',
      label: 'Status',
      type: 'select',
      options: [
        {
          value: ProcedureStatus.NotStarted,
          label: 'Não iniciado',
        },
        {
          value: ProcedureStatus.InProgress,
          label: 'Em progresso',
        },
        {
          value: ProcedureStatus.Finished,
          label: 'Terminado',
        },
      ],
    },
    {
      value: 'IntimationYear',
      label: 'Ano',
    },
    {
      value: 'paramType',
      label: 'Parâmetro',
      type: 'select',
      options: parametersData,
    },
    {
      value: 'processNumber',
      label: 'Número do processo',
    },
    {
      value: 'ProprietyName',
      label: 'Nome',
    },
  ]
  const {selectedOption, setSelectedOption, searchText, setSearchText} = useFilter(options)
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const [proceduresData, setProceduresData] = useState<any[]>([])
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
  const [responseEntity, setResponseEntity] = useState<EntitiesType | null>(null)
  const dteModel = responseEntity?.dte?.dteModel

  useEffect(() => {
    setSelectedProcedures([])
  }, [proceduresData])

  function isSelected(id: string) {
    return selectedProcedures.includes(id)
  }
  function onSelected(id: string) {
    if (isSelected(id)) {
      setSelectedProcedures(selectedProcedures.filter((procedure) => procedure !== id))
    } else {
      setSelectedProcedures([...selectedProcedures, id])
    }
  }
  function selectAll(value: boolean) {
    if (value) {
      setSelectedProcedures(proceduresData.map((procedure) => procedure.id))
    } else {
      setSelectedProcedures([])
    }
  }

  const isAllSelected = selectedProcedures.length === proceduresData.length
  const fiscalProcedures = proceduresData.map(
    (fiscalProcedure: any): TableRowProps => ({
      columns: mapContent([
        <RegisterCheckboxInput
          checked={isSelected(fiscalProcedure.id)}
          onCheckedChange={() => onSelected(fiscalProcedure.id)}
        />,
        fiscalProcedure.cibNumber,
        fiscalProcedure.propriety.name,
        fiscalProcedure.intimationYear,
        getParamTypes(fiscalProcedure.taxParams),
        fiscalProcedure.processNumber,
        getDate(fiscalProcedure.createdAt),
        <FiscalProcedureStatus procedure={fiscalProcedure} />,
      ]),
      detailsColumn: [
      
        {
          content: 'Detalhes',
          className: 'btn-primary',
          buttonAction: () => {},
          href: '/ITR/FiscalProcedureDetails/' + fiscalProcedure.id,
          useRouterLink: true,
        },
      ],
    })
  )
  useEffect(() => {
    setListIsLoading(true)
    getEntitiesAgille().then((res) => setResponseEntity(res.data))
    getFilteredFiscalProcedures(searchText, selectedOption?.value, selectedPage, pageLimit).then(
      ({data: fiscalProceduresData, metadata: meta}) => {
        setProceduresData(fiscalProceduresData)
        setItemsLength(meta.dataSize)
        setListIsLoading(false)
      }
    )
  }, [selectedPage, itemsLength, searchText, selectedOption])

  return (
    <>
      <div className={`card`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Procedimentos Fiscais</span>
          </h3>
          <div className='d-flex flex-row'>
            <div className='py-1'>
              <CustomButton
                isLoading={false}
                label='Exportar arquivo DTE'
                onSubmit={() => {
                  setDteModalIsVisible(true)
                }}
              />
            </div>
            <div className='py-1'>
              <CustomButton
                onSubmit={() => {}}
                isLoading={false}
                target={'_blank'}
                href={'https://cav.receita.fazenda.gov.br/autenticacao/login'}
                label='Acessar DTE ECAC'
              />
            </div>
            <CustomSearchFilter
              onOptionSelected={(option) => setSelectedOption(option)}
              options={options}
              selectedOption={selectedOption}
              onTextChanged={(text) => setSearchText(text)}
              text={searchText}
            ></CustomSearchFilter>
          </div>
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {/* begin::Table container */}
            {fiscalProcedures.length > 0 ? (
              <div className='table-responsive h-450px'>
                {/* begin::Table */}
                <FiscalProcedureConsultTable
                  onAllSelected={selectAll}
                  allSelected={isAllSelected}
                  rows={fiscalProcedures}
                />
                {/* end::Table */}
              </div>
            ) : (
              <EmptyStateList />
            )}

            {/* end::Table container */}
          </div>
        )}
        {fiscalProcedures.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={itemsLength}
            maxPageItens={pageLimit}
          ></TablePagination>
        )}
      </div>
     
      <ModeloModal
        title='Exportação DTE'
        onHide={() => setDteModalIsVisible(false)}
        show={dteModalIsVisible}
        footer={
          <>
            <CustomButton
              isLoading={loadingDTE}
              disabled={loadingDTE}
              label='Exportar arquivos DTE'
              onSubmit={async () => {
                setLoadingDTE(true)
                const exportedAnyProcedure: boolean = await exportProcedures(selectedProcedures)
                if (!exportedAnyProcedure) {
                  setDTEModalError(true)
                }
                setLoadingDTE(false)
              }}
            />
          </>
        }
        body={
          <div className='d-flex flex-column align-items-center'>
            <p>
              O modelo abaixo será usado para a geração das notificações no DTE. Deseja continuar?
            </p>
            <div className='w-250px'>
              <CustomButton
                onSubmit={() => {}}
                isLoading={false}
                href={dteModel}
                label='Baixar modelo'
              />
            </div>
          </div>
        }
      />
      <ModeloModal
        title={'Erro'}
        show={DTEModalError}
        onHide={() => {
          setDteModalIsVisible(false)
          setDTEModalError(false)
        }}
        body={
          <InfoModel
            title='Nenhum arquivo encontrado !'
            message='para exporta arquivos DTE, e necessário fazer upload dos arquivos antes'
          />
        }
      />
    </>
  )
}

function InfoCard({selectedFiscalProcedure}: {selectedFiscalProcedure: any}) {
  return (
    <div className='card shadow-sm w-500px '>
      <div className='p-5 d-flex flex-row justify-content-between'>
        <div className='p-3'>
          <h3 className='card-title'>Procedimento Fiscal</h3>
          <p className='text-muted'>{selectedFiscalProcedure?.id}</p>
        </div>
        <div className='p-3'>
          <p className='text-muted'>Data</p>
          <h3 className='card-title'>{selectedFiscalProcedure?.createdAt}</h3>
        </div>
      </div>
      <img
        alt='Logo'
        src={toAbsoluteUrl('/media/illustrations/custom/admCard.svg')}
        className='h-350px'
      />
    </div>
  )
}

function FiscalProcedureConsult() {
  return <FiscalProcedureTable />
}

export default FiscalProcedureConsult
