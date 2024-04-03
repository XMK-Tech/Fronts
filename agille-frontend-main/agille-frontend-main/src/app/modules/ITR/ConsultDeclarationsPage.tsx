import React, {useEffect, useState} from 'react'
import {ImportButton} from '../../../components/ImportButton'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {getTaxPayerDeclarations, TaxPayerDeclarationType} from '../../services/DeclarationApi'
import {pageLimit} from '../../utils/constants'
import {formatArea} from '../../utils/functions'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {TablePagination, usePagination} from '../auth/components/TablePagination'
export default function ConsultDeclarationsPage() {
  const filterConfig = useFilter([
    {
      value: 'Year',
      label: 'Ano',
    },
    {
      value: 'cib',
      label: 'CIB',
    },

    {
      value: 'UserId',
      label: 'Usuário',
    },
    {
      value: 'ProprietyName',
      label: 'Nome da Propriedade',
    },
  ])

  const [dateDeclarations, setDateDeclarations] = useState<TaxPayerDeclarationType[]>([])
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true)
  const [numberOfItems, setNumberOfItems] = useState<number>(0)
  const {pageSize, selectedPage, setSelectedPage} = usePagination()
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  function refreshList() {
    setIsLoadingList(true)
    getTaxPayerDeclarations(
      selectedPage,
      pageLimit,
      filterConfig.searchText,
      filterConfig.selectedOption?.value
    )
      .then((res) => {
        setNumberOfItems(res.metadata.dataSize)
        setDateDeclarations(res.data)
      })
      .finally(() => setIsLoadingList(false))
  }
  useEffect(() => {
    refreshList()
  }, [selectedPage, pageLimit, filterConfig.searchText, filterConfig.selectedOption?.value])

  const declarationsList = dateDeclarations.map((e) => ({
    columns: mapContent([
      e.cib,
      e.owner,
      formatArea(e.total),
      formatArea(e.permanentPreservationArea),
      formatArea(e.legalReserveArea),
      formatArea(e.taxableArea),
      formatArea(e.areaOccupiedWithWorks),
      formatArea(e.usableArea),
      formatArea(e.areaWithReforestation),
      formatArea(e.areaUsedInRuralActivity),
    ]),
  }))

  return (
    <div className={`card`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Declarações</span>
        </h3>
        <div className='d-flex'>
          <ImportButton type='declaration' refreshList={() => refreshList()} />

          <CustomSearchFilter {...filterConfig}></CustomSearchFilter>
        </div>
      </div>
      <div className='my-5 mx-10'>
        {isLoadingList ? (
          <IsLoadingList />
        ) : (
          <Table
            rows={declarationsList}
            headColumns={mapContent([
              'CIB',
              'Proprietário',
              'Área Total',
              <>
                <span>Área de</span>
                <br /> <span>Preservação</span>
              </>,
              'Área de Reserva',
              'Área tributável',
              <>
                <span>Área Ocupada</span>
                <br /> <span>com Bendeitorias</span>
              </>,
              <>
                <span>Área</span>
                <br /> <span>Aproveitável</span>
              </>,
              ,
              <>
                <span>Área com</span>
                <br /> <span>Reflorestamento</span>
              </>,
              'Área Utilizada',
            ])}
          ></Table>
        )}
        <TablePagination
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={numberOfItems}
          maxPageItens={pageSize}
        ></TablePagination>
      </div>
    </div>
  )
}
