import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap-v5'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../../../setup'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import Table, { TablePropsRows } from '../../components/Table/Table'
import { mapContent } from '../../components/Table/TableHead'
import { TableRowProps } from '../../components/Table/TableRow'
import { getEntities } from '../../services/EntitiesApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import { ListVector } from '../../utils/components/ListVector'
import { pageLimit } from '../../utils/constants'
import { actions } from '../auth'
import { CustomSearchFilter, useFilter } from '../auth/components/AdminSearchFilter'
import { TablePagination, usePagination } from '../auth/components/TablePagination'
import { Entity } from '../auth/redux/AuthTypes'

const MunicípiosTable: React.FC<TablePropsRows> = (props) => {
  const [isHoveredMunicipio, setIsHoveredMunicipio] = useState(false);
  const [isHoveredResponsavel, setIsHoveredResponsavel] = useState(false);

  const normalStyle = {
    color: '#A1A5C5',
  };

  const hoverStyle = {
    color: '#1C274C',
  };

  return (
    <Table
      headColumns={mapContent([
        '',
        (
          <span 
            onClick={props.onMunicipioSortClick} 
            className="cursor-pointer" 
            style={isHoveredMunicipio ? hoverStyle : normalStyle}
            onMouseEnter={() => setIsHoveredMunicipio(true)}
            onMouseLeave={() => setIsHoveredMunicipio(false)}
          >
            MUNICÍPIO
            <ListVector color={isHoveredMunicipio ? '#1C274C' : '#A1A5C5'}/>
          </span>
        ),
        'CNPJ',
        'PENDÊNCIA',
        (
          <span 
            onClick={props.onResponsavelSortClick} 
            className="cursor-pointer" 
            style={isHoveredResponsavel ? hoverStyle : normalStyle}
            onMouseEnter={() => setIsHoveredResponsavel(true)}
            onMouseLeave={() => setIsHoveredResponsavel(false)}
          >
            RESPONSÁVEL
            <ListVector color={isHoveredResponsavel ? '#1C274C' : '#A1A5C5'}/>
          </span>
        ),
        'VISUALIZAR',
      ])}
      rows={props.rows}
    />
  );
};

export const MunicipiosModalInfo: React.FC<MunicipiosModalInfoProps> = (props) => {
  return (
    <>
      <div className=' d-flex flex-row'>
        <p className='pb-3 text-muted'>
          <strong className='text-black'>{props.item}:</strong>
          &ensp; {props.description}
        </p>
        <div className='pb-4 text-muted'> </div>
      </div>
    </>
  )
}
export const MunicipiosInfoCard: React.FC<MunicipiosInfoCardProps> = (props) => {
  return (
    <div className='p-4 card shadow-sm w-500px bg-white'>
      <div className='text-center'>
        <img alt='Logo' src={props.imgUrl} className='h-80px' />
        <div className=' p-4 flex-column'>
          {props.userInfo.map((info, index) => (
            <MunicipiosModalInfo key={index} {...info} />
          ))}
        </div>
      </div>

      <div className='d-flex flex-row justify-content-around'>
        <button type='button' className='btn btn-sm btn-primary'>
          Editar
        </button>
      </div>
    </div>
  )
}
export type MunicipiosInfoCardProps = {
  imgUrl: string
  userInfo: MunicipiosModalInfoProps[]
}
export type MunicipiosModalInfoProps = {
  item: string
  description: string
}
export type MunicipiosTableRowProps = {
  municipio: string
  cnpj: string
  pendencia: boolean
  responsavel: string
  onEntitieSelected: () => void
}
/*  */
export const MunicipiosTableRow: React.FC<MunicipiosTableRowProps> = (props) => {
  return (
    <tr className='text-center'>
      <td>
        <img
          height='30px'
          width='40px'
          className='logo-sticky h-30px'
          alt='Logo'
          src={toAbsoluteUrl('/media/illustrations/custom/backOffice.png')}
        />
      </td>

      <td>
        <div className='d-flex justify-content-center align-items-center align-content-center'>
          <span className='text-dark fw-bolder d-block fs-6 '>{props.municipio}</span>
        </div>
      </td>

      <td>
        <span className='text-dark fw-bolder d-block  fs-6'>{props.cnpj}</span>
      </td>

      <td>
        {props.pendencia && (
          <div className='mb-0 alert alert-dismissible bg-light-danger border-dashed border-danger d-flex flex-column flex-sm-row p-1     justify-content-center'>
            <span className='d-flex align-items-center svg-icon svg-icon-2hx svg-icon-primary mb-2 mb-sm-0'>
              {' '}
              <i className='bi bi-exclamation fs-1 text-danger'></i>
            </span>
            <div className='justify-content-center align-items-center d-flex  pe-0'>
              <strong className='text-danger'>Possui pendências{props.pendencia}</strong>
            </div>
          </div>
        )}
        {!props.pendencia && (
          <div className='mb-0 alert alert-dismissible bg-light-success border-dashed border-success d-flex flex-column flex-sm-row p-1     justify-content-center'>
            <span className='d-flex align-items-center svg-icon svg-icon-2hx svg-icon-primary mb-2 mb-sm-0'>
              {' '}
            </span>
            <div className='justify-content-center align-items-center d-flex  pe-0'>
              <strong className='text-success'>Sem pendências{props.pendencia}</strong>
            </div>
          </div>
        )}
      </td>

      <td>
        <span className='text-dark fw-bolder d-block fs-6'>{props.responsavel}</span>
      </td>

      <td className='text-end'>
        <Link
          className='btn btn-primary btn-sm px-4 me-7'
          onClick={() => {
            props.onEntitieSelected()
          }}
          to={'/backoffice/importacao'}
        >
          Abrir
        </Link>
      </td>
    </tr>
  )
}

const EntityTable: React.FC<{}> = () => {
  const dispatch = useDispatch()

  const [entities, setEntities] = useState<TableRowProps[]>([])

  const [sortOrder, setSortOrder] = useState<TablePropsRows["sortOrder"]>('none');
  const [sortOrderColumns, setSortOrderColumns] = useState<'cityName' | 'responsavel' | 'none'>('none');
  function toggleSortOrder(field: 'cityName' | 'responsavel') {

    if (field !== sortOrderColumns) setSortOrder('none');
    
    setSortOrderColumns(field)

    setSortOrder((prevOrder) => {
      if (prevOrder === 'asc') {
        return 'desc';
      }
      if (prevOrder === 'desc') {
        return 'none'
      };
      if (prevOrder === 'none') {
        return 'asc';
      }
    });
  };

  const [listIsLoading, setListIsLoading] = useState(false)
  const { pageSize, selectedPage, setSelectedPage, setSize, size } = usePagination()

  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }

  const selectedEntitie = useSelector<RootState>(({ auth }) => auth.selectedEntity, shallowEqual) as
    | Entity
    | undefined

  const filterConfig = useFilter([
    { value: 'County', label: 'Município' },
    { value: 'Document', label: 'CNPJ' },
    { value: 'Responsible', label: 'Responsável' },
  ])
  useEffect(() => {
    setListIsLoading(true)
    getEntities(
      selectedPage,
      pageLimit,
      filterConfig.searchText,
      filterConfig.selectedOption?.value
    ).then(({ data: entities, metadata }) => {
      function sortOrderResponsavel() {
        if (sortOrder === 'asc') {
          entities.sort(function (a: any, b: any) {
            const cityNameA = a.responsible.fullname.toUpperCase();
            const cityNameB = b.responsible.fullname.toUpperCase();
  
            if (cityNameA < cityNameB) {
              return -1;
            }
            if (cityNameA > cityNameB) {
              return 1;
            }
  
            return 0;
          })
        } else if (sortOrder === 'desc') {
          entities.sort(function (a: any, b: any) {
            const cityNameA = a.responsible.fullname.toUpperCase();
            const cityNameB = b.responsible.fullname.toUpperCase();
  
            if (cityNameA > cityNameB) {
              return -1;
            }
            if (cityNameA < cityNameB) {
              return 1;
            }
            return 0;
          })
        }
      }

      function sortOrderCityName() {
        if (sortOrder === 'asc') {
          entities.sort(function (a: any, b: any) {
            const cityNameA = a.address.cityName.toUpperCase();
            const cityNameB = b.address.cityName.toUpperCase();
  
            if (cityNameA < cityNameB) {
              return -1;
            }
            if (cityNameA > cityNameB) {
              return 1;
            }
  
            return 0;
          })
        } else if (sortOrder === 'desc') {
          entities.sort(function (a: any, b: any) {
            const cityNameA = a.address.cityName.toUpperCase();
            const cityNameB = b.address.cityName.toUpperCase();
  
            if (cityNameA > cityNameB) {
              return -1;
            }
            if (cityNameA < cityNameB) {
              return 1;
            }
            return 0;
          })
        }
      }

      sortOrderColumns === 'cityName' ? sortOrderCityName() : sortOrderResponsavel();

      setSize(metadata.dataSize)
      setEntities(
        entities.map((entity: any): TableRowProps => {
          let pendency = <div></div>
          if (!entity.connectionConfigured) {
            pendency = (
              <div className='mb-0 alert alert-dismissible bg-light-danger border-dashed border-danger d-flex flex-column flex-sm-row p-1     justify-content-center'>
                <span className='d-flex align-items-center svg-icon svg-icon-2hx svg-icon-primary mb-2 mb-sm-0'>
                  {' '}
                  <i className='bi bi-exclamation fs-1 text-danger'></i>
                </span>
                <div className='justify-content-center align-items-center d-flex  pe-0'>
                  <strong className='text-danger'>Configuração Pendente</strong>
                </div>
              </div>
            )
          } else {
            pendency = (
              <div className='mb-0 alert alert-dismissible bg-light-success border-dashed border-success d-flex flex-column flex-sm-row p-1     justify-content-center'>
                <span className='d-flex align-items-center svg-icon svg-icon-2hx svg-icon-primary mb-2 mb-sm-0'>
                  {' '}
                </span>
                <div className='justify-content-center align-items-center d-flex  pe-0'>
                  <strong className='text-success'>Não possui pendência</strong>
                </div>
              </div>
            )
          }
          return {
            columns: mapContent([
              <img height='35px' alt='Logo' src={entity.entityImage} />,
              <div className='d-flex justify-content-center align-items-center align-content-center'>
                <span className='text-dark fw-bolder d-block fs-6 '>
                  {entity?.address?.cityName}
                </span>
              </div>,
              <span className='text-dark fw-bolder d-block  fs-6'>{entity?.document}</span>,
              pendency,
              <span className='text-dark fw-bolder d-block fs-6'>
                {entity?.responsible?.fullname}{' '}
              </span>,
            ]),
            detailsColumn: [
              {
                content: 'Abrir',
                className: 'btn-primary',
                buttonAction: () => {
                  dispatch(actions.selectEntity(entity.id))
                },
                href: '/backoffice/importacao',
              },
            ],
          }
        })
      )

      setListIsLoading(false)
      if (!selectedEntitie && entities.length > 0) {
        dispatch(actions.selectEntity(entities[0].id))
      }
    })
  }, [selectedPage, selectedEntitie, filterConfig.searchText, filterConfig.selectedOption?.value, sortOrder, sortOrderColumns])

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Municípios</span>
          </h3>
          <CustomSearchFilter {...filterConfig} />
        </div>
        {listIsLoading ? (
          <IsLoadingList />
        ) : (
          <div className='card-body py-3'>
            {entities.length > 0 ? (
              <div className='table-responsive'>
                <MunicípiosTable
                  rows={entities}
                  onMunicipioSortClick={() => toggleSortOrder('cityName')}
                  onResponsavelSortClick={() => toggleSortOrder('responsavel')}
                />
              </div>
            ) : (
              <EmptyStateList />
            )}
          </div>
        )}
        {entities.length > 0 && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={size}
            maxPageItens={pageSize}
          ></TablePagination>
        )}
      </div>
    </>
  )
}

export default function MunicipiosPage() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [municipiosList, setMunicipioList] = useState([{ municipio: 'Belo Horizonte' }])

  const listM = municipiosList.map((i, index) => (
    <div
      key={index}
      className='alert alert-dismissible bg-light-danger border-dashed border-danger d-flex flex-column flex-sm-row p-2 mb-5'
    >
      <span className='d-flex align-items-center svg-icon svg-icon-2hx svg-icon-primary me-4 mb-2 mb-sm-0'>
        {' '}
        <i className='bi bi-exclamation fs-1 text-danger'></i>
      </span>
      <div className='justify-content-center align-items-center d-flex  pe-0 pe-sm-10'>
        <strong className='me-2'> {i.municipio} </strong>
        Requer configuração
      </div>
    </div>
  ))
  return (
    <>
      <EntityTable />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <i className='text-black fs-1 fas fa-laptop-code'></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{listM}</Modal.Body>
        <Modal.Footer>
          <div className='btn btn-primary' onClick={handleClose}>
            Continuar
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}