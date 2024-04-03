import React, {PropsWithChildren, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {RegisterFormModelInput} from '../../../components/RegisterFormModel'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import DrawMap from '../../components/DrawMap/DrawMap'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {
  getPropriety,
  PropertyType,
  ProprietyType,
  settlementType,
} from '../../services/ProprietyApi'
import IsLoadingList from '../../utils/components/IsLoadingList'
import ModeloModal from '../../utils/components/ModeloModal'
import {TablePagination} from '../auth/components/TablePagination'
import {PersonTypeLabel} from './PersonTypeLabel'
import {convertNumberToStringValue} from '../../utils/functions/masks'
export default function PropertyConsultPage() {
  const [showModalProperty, setShowModalProperty] = useState(false)
  const [loadingPage, setLoadingPage] = useState(false)
  const {id} = useParams<{id: string}>()
  const [proprietyId, setProprietyId] = useState<ProprietyType>()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    getPropriety(id)
      .then((res) => {
        setProprietyId(res.data)
      })
      .finally(() => setIsLoading(false))
  }, [])
  const proprietyContact = proprietyId?.contact
  const proprietyAddress = proprietyId?.address
  const proprietyCharacteristics = proprietyId?.characteristics

  const points = proprietyId?.location?.coordenates ?? []

  const propertys = proprietyId?.owners ?? []

  const propertyList = propertys.map((e) => ({
    columns: mapContent([e.name, e.document, <PersonTypeLabel type={e.type} />]),
  }))
  function getTypeProperty(type: any) {
    switch (type) {
      case PropertyType.Chacara:
        return 'Chácara'
      case PropertyType.Fazenda:
        return 'Fazenda'
      case PropertyType.Estancia:
        return 'Estância'
      case PropertyType.Haras:
        return 'Haras'
      case PropertyType.Fishing:
        return 'Pesqueiro'
      case PropertyType.Ranch:
        return 'Rancho'
      case PropertyType.Sitio:
        return 'Sitío'
      case PropertyType.Other:
        return 'Outro'
      default:
        return 'Outro'
    }
  }
  function getTypeSettlementName(type: any) {
    switch (type) {
      case settlementType.Dominio:
        return 'Domínio'
      case settlementType.Possossao:
        return 'Possessão'
    }
  }

  return (
    <div className='card'>
      {loadingPage ? (
        <IsLoadingList />
      ) : (
        <>
          <div className='card-header border-0'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Detalhes da Propriedade</span>
            </h3>
            <div className='d-flex align-items-center h-10'>
              <CustomButton
                label='Editar'
                link={`/ITR/ITRMainPage/RegisterProperty/${id}`}
                onSubmit={() => {}}
                isLoading={false}
              ></CustomButton>

              <CustomButton
                label='Proprietarios'
                onSubmit={() => setShowModalProperty(!showModalProperty)}
                isLoading={false}
              ></CustomButton>
            </div>
          </div>
          <div className='card-body'>
            {isLoading ? (
              <IsLoadingList />
            ) : (
              <>
                <DetailsModel title='Informações Básicas'>
                  <ColumnDetails
                    info={[
                      {label: 'CIB', info: proprietyId?.cibNumber},
                      {label: 'Nome do Imóvel', info: proprietyId?.name},
                      {label: 'Tipo do Imóvel', info: getTypeProperty(proprietyId?.type)},
                      {
                        label: 'Area Declarada (m²)',
                        info: convertNumberToStringValue(proprietyId?.declaredArea || ''),
                      },
                    ]}
                  ></ColumnDetails>
                  <ColumnDetails
                    info={[
                      {label: 'Codigo do incra', info: proprietyId?.incraCode},
                      {label: 'Inscrição Municipal', info: proprietyId?.registration},
                      {label: 'Numero do Car', info: proprietyId?.carNumber},
                      {label: 'Matricula', info: proprietyId?.municipalRegistration},
                    ]}
                  ></ColumnDetails>
                </DetailsModel>
                <DetailsModel title='Endereço'>
                  <ColumnDetails
                    info={[
                      {label: 'Cep', info: proprietyAddress?.zipcode},
                      {label: 'Logradouro', info: proprietyAddress?.street},
                      {label: 'Número', info: proprietyAddress?.number},
                      {label: 'Complemento', info: proprietyAddress?.complement},
                    ]}
                  ></ColumnDetails>
                  <ColumnDetails
                    info={[
                      {label: 'Caixa postal', info: proprietyAddress?.postalCode},
                      {label: 'Município', info: proprietyAddress?.cityName},
                      {label: 'Localização', info: proprietyAddress?.street},
                    ]}
                  ></ColumnDetails>
                </DetailsModel>
                <DetailsModel title='Contato'>
                  <ColumnDetails
                    info={[
                      {label: 'Fax', info: proprietyContact?.fax},
                      {label: 'Telefone', info: proprietyContact?.phoneNumber},
                    ]}
                  ></ColumnDetails>
                  <ColumnDetails
                    info={[{label: 'Email', info: proprietyContact?.email}]}
                  ></ColumnDetails>
                </DetailsModel>
                <DetailsModel title='Características'>
                  <ColumnDetails
                    info={[
                      {
                        label: 'Energia elétrica',
                        info: <Badge active={proprietyCharacteristics?.hasElectricity}></Badge>,
                      },
                      {
                        label: 'Telefone',
                        info: <Badge active={proprietyCharacteristics?.hasPhone}></Badge>,
                      },
                      {
                        label: 'Internet',
                        info: <Badge active={proprietyCharacteristics?.hasInternet}></Badge>,
                      },
                      {
                        label: 'Potencial Pesqueiro',
                        info: (
                          <Badge active={proprietyCharacteristics?.hasFishingPotential}></Badge>
                        ),
                      },
                      {
                        label: 'Potencial para ecoturismo',
                        info: (
                          <Badge active={proprietyCharacteristics?.hasFishingPotential}></Badge>
                        ),
                      },
                    ]}
                  ></ColumnDetails>
                  <ColumnDetails
                    info={[
                      {
                        label: 'Nascentes',
                        info: (
                          <Badge active={proprietyCharacteristics?.hasNaturalWaterSpring}></Badge>
                        ),
                      },
                      {
                        label: 'área de assentamento',
                        info: (
                          <Badge
                            active={proprietyCharacteristics?.hasPotentialForEcotourism}
                          ></Badge>
                        ),
                      },
                      {label: 'Nome do assentamento', info: proprietyId?.settlementName},
                      {
                        label: 'Tipo do assentamento',
                        info: getTypeSettlementName(proprietyId?.settlementType),
                      },
                    ]}
                  ></ColumnDetails>
                </DetailsModel>
                <DetailsModel title='Características Legais'>
                  <ColumnDetails
                    info={[
                      {
                        label: 'certificado conforme lei 10.267/01',
                        info: <Badge active={proprietyId?.hasPropertyCertificate}></Badge>,
                      },
                      {label: 'Número certificado INCRA', info: proprietyId?.incraCode},
                      {
                        label: 'Reserva legal regularizada no órgão',
                        info: <Badge active={proprietyId?.hasRegularizedLegalReserve}></Badge>,
                      },
                      {label: 'Área', info: proprietyId?.declaredArea},
                    ]}
                  ></ColumnDetails>
                  <ColumnDetails
                    info={[
                      {
                        label: 'posseiros na área',
                        info: <Badge active={proprietyId?.hasSquattersInTheArea}></Badge>,
                      },
                      {
                        label: 'percentual de ocupação',
                        info: `${proprietyId?.occupancyPercentage}%`,
                      },
                      {label: 'tempo de ocupação (em anos)', info: proprietyId?.occupancyTime},
                    ]}
                  ></ColumnDetails>
                </DetailsModel>

                <DetailsModel title='Área da Propriedade'>
                  <DrawMap points={points} />
                </DetailsModel>
              </>
            )}
          </div>
        </>
      )}

      <ModeloModal
        show={showModalProperty}
        onHide={() => setShowModalProperty(!showModalProperty)}
        title='LISTA DE PROPRIETÁRIOS'
        body={
          <>
            <Table
              rows={propertyList || []}
              headColumns={mapContent(['NOME', 'DOCUMENTO', 'TIPO'])}
            ></Table>
            <TablePagination
              arrayLength={3}
              maxPageItens={5}
              selectedPage={1}
              onSelectedPageChanged={() => {}}
            ></TablePagination>
          </>
        }
      ></ModeloModal>
    </div>
  )
}
type DetailsModelProps = {
  title: string
}
export function DetailsModel(props: PropsWithChildren<DetailsModelProps>) {
  return (
    <>
      <div className='card mb-5' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>{props.title}</h3>
          </div>
        </div>
        <div className='d-flex flex-wrap'>{props.children}</div>
      </div>
    </>
  )
}
type InfoLabelProps = {
  label: string
  info: React.ReactNode
}
export function InfoLabel(props: InfoLabelProps) {
  return (
    <>
      <div className='row mb-10 align-item'>
        <label className='col-lg-4 fw-bold text-muted'>{props.label}</label>
        <div className='col-lg-8'>
          <span className='fw-bold fs-6 text-gray-800'>{props.info}</span>
        </div>
      </div>
    </>
  )
}

export function ColumnDetails(props: {info: InfoLabelProps[]}) {
  return (
    <div className='card-body p-9'>
      {props.info.map((e) => (
        <InfoLabel {...e}></InfoLabel>
      ))}
    </div>
  )
}
type FileProps = {
  file: string
}
export function File(props: FileProps) {
  return (
    <div className='card h-100'>
      <div className='card-body d-flex justify-content-center text-center flex-column p-8'>
        <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
          <div className='symbol symbol-60px mb-5'>
            <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt=''></img>
          </div>

          <div className='fs-5 fw-bolder mb-2'>{props.file}</div>
        </a>
      </div>
    </div>
  )
}
type BadgeProps = {
  active: boolean | undefined
}
export function Badge(props: BadgeProps) {
  return (
    <>
      {props.active ? (
        <span className={`mw-150px text-wrap badge badge-success fw-bolder`}>sim</span>
      ) : (
        <span className={`mw-150px text-wrap badge badge-danger fw-bolder`}>não</span>
      )}
    </>
  )
}
