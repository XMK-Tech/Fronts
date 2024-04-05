import {useEffect, useState} from 'react'
import {ImportButton} from '../../../components/ImportButton'
import Table, {TablePropsRows} from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {getProprieties, ProprietyType} from '../../services/ProprietyApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {TablePagination, usePagination} from '../auth/components/TablePagination'
import ITRCultureManagementModal from './Components/ITRCultureManagementModal'
import ITRModalHerds from './Components/ITRModalHerds'
import {convertNumberToStringValue} from '../../utils/functions/masks'

const PropietyListTable: React.FC<TablePropsRows> = (props) => {
  return (
    <Table
      headColumns={mapContent([
        'CIB',
        'Cidade',
        'INSCRIÇÃO MUNICIPAL',
        'NOME',
        'MUNICÍPIO',
        'ÁREA DECLARADA',
        'AÇÕES',
      ])}
      rows={props.rows}
    />
  )
}

type PropertyConsultPageProps = {
  type: number
}
export default function PropertyConsultPage(props: PropertyConsultPageProps) {
  const options = [
    {value: 'cib', label: 'CIB'},
    {value: 'year', label: 'Ano'},
    {value: 'name', label: 'Nome'},
    {value: 'cityName', label: 'Múnicipio'},
  ]
  const {selectedOption, setSelectedOption, searchText, setSearchText} = useFilter(options)
  const {pageSize, selectedPage, setSelectedPage, setSize, size} = usePagination()
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  const [listIsLoading, setListIsLoading] = useState(false)
  const [proprietys, setProprietys] = useState<ProprietyType[]>([])
  const [showModalHerds, setShowModalHerds] = useState(false)
  const [showModalCultureDeclaration, setShowModalCultureDeclaration] = useState(false)
  const [getPropertyId, setGetPropertyId] = useState('')
  useEffect(() => {
    setListIsLoading(true)
    getProprieties(searchText, selectedOption?.value, selectedPage)
      .then((res) => {
        setProprietys(res.data)
        setSize(res.metadata.dataSize)
      })
      .finally(() => setListIsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage, size, searchText, selectedOption])

  const proprietysList = proprietys.map((e) => ({
    columns: mapContent([
      e.cibNumber,
      e.address?.cityName,
      e.municipalRegistration,
      e.name,
      e.address?.cityName,
      convertNumberToStringValue(e.declaredArea),
    ]),
    detailsColumn: [
      {
        content: 'Ajuste de Rebanho',
        className: 'btn-primary ',
        buttonAction: () => {
          setGetPropertyId(e.id || '')
          setShowModalHerds(!showModalHerds)
        },
      },
      {
        content: 'Gestão de Propriedades',
        className: 'btn-primary mx-2',

        buttonAction: () => {
          console.log(getPropertyId)
          setGetPropertyId(e.id || '')
          setShowModalCultureDeclaration(!showModalCultureDeclaration)
        },
      },
      {
        content: 'Detalhes',
        className: 'btn-primary',
        buttonAction: () => {},
        href: '/ITR/ITRMainPage/DetailsProperty/' + e.id,
        useRouterLink: true,
      },
      {
        content: 'Dados para laudo',
        className: 'btn-primary mx-2',
        buttonAction: () => { },
        href: '/ITR/RegisterBareLand',
        useRouterLink: true,
      }
    ],
  }))

  return (
    <>
      <div className='card'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Imóveis</span>
          </h3>
          <div className='d-flex'>
            <ImportButton type='propriety' />
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
            {proprietysList.length > 0 ? (
              <div className='table-responsive w-100'>
                <PropietyListTable rows={proprietysList} />
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {!!proprietysList.length && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={size}
            maxPageItens={pageSize}
          ></TablePagination>
        )}
        <ITRModalHerds
          id={getPropertyId}
          onHide={() => setShowModalHerds(!showModalHerds)}
          show={showModalHerds}
        ></ITRModalHerds>
        <ITRCultureManagementModal
          onHide={() => setShowModalCultureDeclaration(!showModalCultureDeclaration)}
          show={showModalCultureDeclaration}
          id={getPropertyId}
        />
      </div>
    </>
  )
}
