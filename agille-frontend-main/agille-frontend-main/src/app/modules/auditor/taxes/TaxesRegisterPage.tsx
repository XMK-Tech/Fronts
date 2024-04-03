import React, {useEffect, useState} from 'react'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {TablePagination} from '../../auth/components/TablePagination'
import EmptyStateList from '../../../utils/components/EmptyStateList'
import {formatCnpj, numberLimit} from '../../../utils/functions'
import {useParams} from 'react-router-dom'
import {
  CompanyCardRate,
  CompanyCardRateClient,
  getCompanyCardRateClient,
  getJuridicalPerson,
  getTaxPayersWithRates,
  JuridicalPerson,
  updateJuridicalPerson,
} from '../../../services/JuridicalPersonApi'
import {
  createCompanyCardRate,
  deleteCompanyCardRate,
  getCompanyCardRate,
  getCompanyCardRateAverage,
} from '../../../services/PersonApi'
import Table from '../../../components/Table/Table'
import {mapContent} from '../../../components/Table/TableHead'
import ModeloModal from '../../../utils/components/ModeloModal'
import {CustomSearchFilter, useFilter} from '../../auth/components/AdminSearchFilter'

import NumberFormat from 'react-number-format'
import {pageLimit} from '../../../utils/constants'
import IsLoadingList from '../../../utils/components/IsLoadingList'

function BuildingTaxRegisterPage({}) {
  const [legalPerson, setLegalPerson] = useState<JuridicalPerson[]>([])
  const [companyCardRateClient, setCompanyCardRateClient] = useState<CompanyCardRateClient[]>([])
  const [selectedLegalPersonId, setSelectedLegalPersonId] = useState<string>()
  const [person, setPerson] = useState<JuridicalPerson | null>(null)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const {id} = useParams<{id: string}>()
  const taxPayer = legalPerson.find((c) => c.id == selectedLegalPersonId)
  const options = [
    {
      label: 'CNPJ',
      value: 'document',
    },
    {
      label: 'Razão Social',
      value: 'name',
    },
  ]
  type CompanyCardRateAverage = {
    average: number
    cardOperatorId: 'string'
    count: number
    declaredRate: number
  }
  const {searchText, selectedOption, setSearchText, setSelectedOption} = useFilter(options)
  const [showModal, setShowModal] = useState(false)
  const [companyCardList, setCompanyCardList] = useState<CompanyCardRate[]>([])
  const [clientsLength, setClientsLength] = useState(0)
  const [loadingDeleteId, setLoadingDeleteId] = useState('')
  const [tax, setTax] = useState(taxPayer?.cardRate)
  const [itemsLength, setItemsLength] = useState(0)
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [cardRateCompanyValue, setCardRateCompanyValue] = useState(person?.cardRate)
  const [editCardRateLoading, setEditCardRateLoading] = useState(false)

  const [cardRateAverage, setCardRateAverage] = useState<CompanyCardRateAverage>()

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  async function companyCardRateAverage() {
    getCompanyCardRateAverage(id).then((res) => {
      setCardRateAverage(res.data)
    })
  }
  function refreshCompanyData() {
    return getJuridicalPerson(id).then((res) => {
      setPerson(res.data)
    })
  }
  function refreshCompanyCardClient() {
    getCompanyCardRateClient(id, searchText, selectedOption.value, selectedPage, pageLimit)
      .then((res) => {
        setCompanyCardRateClient(res.data)
        setItemsLength(res.metadata.dataSize)
      })
      .finally(() => setIsLoadingList(false))
  }
  async function refreshList() {
    const res = await getCompanyCardRate(id, selectedPage, pageLimit)
    setCompanyCardList(res.data)
    companyCardRateAverage()
    setClientsLength(res.metadata.dataSize)
    setCreateLoading(false)
    setLoadingDeleteId('')
  }

  useEffect(() => {
    setIsLoadingList(true)
    refreshCompanyData()
    refreshList().finally(() => setIsLoadingList(false))
  }, [id])
  useEffect(() => {
    setIsLoadingList(true)
    refreshCompanyCardClient()
    getTaxPayersWithRates(id, searchText, selectedOption.value, selectedPage, pageLimit)
      .then((res) => {
        setLegalPerson(res.data)
        setItemsLength(res.metadata.dataSize)
      })
      .finally(() => setIsLoadingList(false))
  }, [searchText, selectedOption, selectedPage, id])

  const removeClient = async (id: string) => {
    setLoadingDeleteId(id)
    await deleteCompanyCardRate(id)
    refreshList()
  }
  const addClient = async () => {
    if (!selectedLegalPersonId || !tax) return
    await createCompanyCardRate(Number(tax), selectedLegalPersonId, id)
    setCreateLoading(!createLoading)
    refreshList()
    setShowModal(false)
  }
  const editCardRateValue = (id: string, cardRate: number | undefined) => {
    if (person == null) {
      return
    }
    setEditCardRateLoading(true)
    updateJuridicalPerson(id, {...person, cardRate, date: new Date(person.date)}).finally(() => {
      refreshCompanyCardClient()
      refreshCompanyData().finally(() => setEditCardRateLoading(false))
    })
  }

  const [createLoading, setCreateLoading] = useState(false)
  const cardOperator = `${person?.displayName} - ${formatCnpj(person?.document)}`

  const clientsList = companyCardList.map((e) => ({
    columns: mapContent([e.companyDocument, e.companyName, `${e.rate}%`]),
    detailsColumn: [
      {
        content: 'Apagar',
        className: 'btn-danger',
        buttonAction: () => removeClient(e.id),
        isLoading: e.id === loadingDeleteId,
      },
    ],
  }))
  const companyCardClientslist = companyCardRateClient.map((e) => ({
    columns: mapContent([e.name, e.document, e.rate == null ? '-' : `${e.rate}%`]),
    detailsColumn: [
      {
        content: 'Selecionar',
        className: 'btn-primary',
        buttonAction: () => {
          setSelectedLegalPersonId(e.id)
          setTax(e.rate)
        },
      },
    ],
  }))

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            {!isLoadingList && (
              <span className='card-label fw-bolder fs-3 mb-1'>
                Taxa de administração praticada pela operadora {cardOperator}
              </span>
            )}
          </h3>
        </div>
        {isLoadingList ? (
          <IsLoadingList />
        ) : (
          <div className='card-body d-flex justify-content-center'>
            <div className='card-body d-flex flex-column justify-content-center flex-grow-0 shadow rounded bg-light me-4 '>
              <div className='card-body d-flex flex-row justify-content-between p-0'>
                <div className='d-flex flex-column '>
                  <p className='fw-bolder fs-3'>Informações da Operadora</p>
                  <p className='fw-bolder text-center my-10 fs-1 text-primary ms-3 '>
                    {cardOperator}
                  </p>
                  <p className='fw-bolder text-center my-5 fs-1 text-primary ms-3 '>
                    Taxa Padrão - {person?.cardRate}%
                  </p>
                  <div className='my-10 text-center'>
                    <label className='form-label' placeholder='Digite o valor padrão'>
                      Alterar o valor da Taxa Padrão
                    </label>

                    <NumberFormat
                      suffix='%'
                      className='form-control me-4'
                      placeholder='Digite o valor a ser alterado'
                      value={cardRateCompanyValue}
                      onChange={(e: any) =>
                        numberLimit(
                          Number(e.target.value.slice(0, e.target.value.length - 1)),
                          setCardRateCompanyValue,
                          100
                        )
                      }
                    ></NumberFormat>

                    <div className='d-flex my-10 align-items justify-content-center'>
                      <CustomButton
                        onSubmit={() => editCardRateValue(id, cardRateCompanyValue)}
                        label=' Salvar nova taxa'
                        isLoading={editCardRateLoading}
                      ></CustomButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
              <div className='card-body d-flex flex-column  shadow rounded bg-light ms-4 text-center '>
                <div className='d-flex flex-row justify-content-between'>
                  <div className='flex-column flex-grow-1'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span className='fw-bolder fs-3'>Taxa praticada pelos clientes</span>
                      <CustomButton
                        onSubmit={() => setShowModal(!showModal)}
                        label='Adicionar'
                        isLoading={false}
                      ></CustomButton>
                    </div>
                    {/* TODO: Pagination */}
                    {companyCardList?.length ? (
                      <Table
                        rows={clientsList}
                        headColumns={mapContent(['CNPJ', 'RAZÃO SOCIAL', 'TAXA'])}
                      ></Table>
                    ) : (
                      <EmptyStateList text='Ainda não foram informadas taxas para os clientes desta operadora. Você pode informá-los usando o formulário ao lado.' />
                    )}
                    <div className='d-flex justify-content-between'>
                      <div className='d-flex align-items-center'>
                        <label className='form-label' placeholder='Digite o valor padrão'>
                          Taxa média para estimativa :
                        </label>
                        <p className='fw-bolder fs-1 text-primary ms-3 '>
                          {cardRateAverage?.average}%
                        </p>
                      </div>

                      <TablePagination
                        onSelectedPageChanged={onSelectedPageChanged}
                        selectedPage={selectedPage}
                        arrayLength={clientsLength}
                        maxPageItens={6}
                      ></TablePagination>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        )}
      </div>
      <ModeloModal
        size='xl'
        title={
          <>
            <div className='d-flex align-items-center justify-content-between'>
              <div>Consultar Clientes</div>
              <div>
                {
                  <CustomSearchFilter
                    onOptionSelected={setSelectedOption}
                    onTextChanged={setSearchText}
                    options={options}
                    selectedOption={selectedOption}
                    text={searchText}
                  ></CustomSearchFilter>
                }
              </div>
            </div>
          </>
        }
        onHide={() => setShowModal(!showModal)}
        show={showModal}
        body={
          <>
            <div className='mb-5'>
              <p className='text-muted fs-4'>
                Selecione um cliente para poder adcionar ou editar o valor da Taxa de Administração
              </p>
            </div>
            <span
              className={`${taxPayer ? 'fw-bolder fs-3 mb-3' : 'text-muted fw-bolder fs-3 mb-3'}`}
            >
              {taxPayer ? taxPayer.name : ' Cliente Selecionado'}{' '}
            </span>
            <div className='d-flex align-items-center mb-8'>
              <div className='d-flex my-2 w-50'>
                <NumberFormat
                  className='form-control me-4'
                  disabled={!selectedLegalPersonId && true}
                  placeholder='Digite o valor da taxa de administração'
                  value={tax}
                  suffix='%'
                  onChange={(e: any) =>
                    setTax(Number(e.target.value.slice(0, e.target.value.length - 1)))
                  }
                />
                <CustomButton
                  disabled={!selectedLegalPersonId && true}
                  isLoading={false}
                  label='Aplicar'
                  onSubmit={addClient}
                ></CustomButton>
              </div>
            </div>
            {isLoadingList ? (
              <IsLoadingList />
            ) : (
              <Table
                rows={companyCardClientslist}
                headColumns={mapContent(['RAZÃO SOCIAL', 'CNPJ/CPF', 'TAXA', 'SELECIONAR'])}
              ></Table>
            )}
            <TablePagination
              onSelectedPageChanged={onSelectedPageChanged}
              selectedPage={selectedPage}
              arrayLength={itemsLength}
              maxPageItens={6}
            ></TablePagination>
          </>
        }
      ></ModeloModal>
    </>
  )
}

export default function TaxRegisterPage() {
  return <BuildingTaxRegisterPage />
}
