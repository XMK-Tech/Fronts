import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {getPersonById, getPersons, PersonType, putUser, putUsers} from '../../services/PersonApi'
import EmptyStateList from '../../utils/components/EmptyStateList'
import IsLoadingList from '../../utils/components/IsLoadingList'
import {pageLimit} from '../../utils/constants'
import {CustomSearchFilter, useFilter} from '../auth/components/AdminSearchFilter'
import {DetailsCard} from '../../components/Table/TableDetailsModal'
import {TablePagination} from '../auth/components/TablePagination'
import {formatCnpj, formatDate} from '../../utils/functions'
import Table from '../../components/Table/Table'
import {mapContent} from '../../components/Table/TableHead'
import {PersonTypeLabel} from './PersonTypeLabel'
import {ImportButton} from '../../../components/ImportButton'
import {CustomButton} from '../../components/CustomButton/CustomButton'
import InfoModel from './Components/InfoModel'
import {FormError} from '../../../components/FormError'
type TableRowProps = {
  field1: PersonType
  field2: string
  field3: string
  field4: string
  field5: string
  field6: string
  field7: string
  field8: string
  modalId: string
  onPersonSelected: () => void
}

type PersonsPhonesProps = {
  number: string
  type?: number
  typeDescription?: string
}
type PersonsAddresses = {
  cityId?: string
  cityName?: string
  complement?: string
  countryId?: string
  countryName?: string
  district?: string
  id: string
  number?: string
  owner?: string
  ownerId?: string
  stateId?: string
  stateName?: string
  street?: string
  type?: number
  typeDescription?: string
  zipcode?: string
}
type PersonsByIdProps = {
  addresses: PersonsAddresses[]
  displayName: string
  document: string
  emails: string[]
  id: string
  juridicalOrPhysicalPersonId?: string
  municipalRegistration: string
  name: string
  personType?: 2
  phones: PersonsPhonesProps[]
  profilePicUrl?: string
  createdAt: string
  hasUser?: boolean
}
const UserTable: React.FC<{}> = () => {
  const [persons, setPersons] = useState<TableRowProps[]>([])
  const [itemsLength, setItemsLength] = useState(0)
  const [selectedPerson, setSelectedPerson] = React.useState<PersonsByIdProps>()
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [listIsLoading, setListIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{message: any} | null>(null)
  const [info, setInfo] = useState(false)
  const [infoFinally, setInfoFinally] = useState(false)
  const [infoConfirmated, setInfoConfirmated] = useState(false)
  const modalCardInfo = [
    {item: 'Nome', description: selectedPerson?.name || ''},
    {item: 'CNPJ', description: formatCnpj(selectedPerson?.document) || ''},
    {item: 'Inscrição Municipal', description: selectedPerson?.municipalRegistration || ''},
    {
      item: 'Rua',
      description: selectedPerson?.addresses[0]?.street || '',
    },
    {
      item: 'Número',
      description: selectedPerson?.addresses[0]?.number || '',
    },
    {
      item: 'Complemento',
      description: selectedPerson?.addresses[0]?.complement || '',
    },
    {
      item: 'Bairro',
      description: selectedPerson?.addresses[0]?.district || '',
    },

    {
      item: 'CEP',
      description: selectedPerson?.addresses[0]?.zipcode || '',
    },
  ]
  const options = [
    {value: 'Document', label: 'CPF/ CNPJ'},
    {value: 'Name', label: 'Nome/ Razão Social'},
    {value: 'DisplayName', label: 'Apelido/ Nome Fantasia'},
    {value: 'Cib', label: 'CIB'},
  ]
  const [personId, setPersonId] = React.useState<string | null>(null)
  const {selectedOption, setSelectedOption, searchText, setSearchText} = useFilter(options)
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page)
  }
  function refreshPersons() {
    setLoading(true)
    if (personId) {
      getPersonById(personId)
        .then(({data: user}) => {
          setSelectedPerson({
            id: user.id,
            name: user.name,
            document: formatCnpj(user.document),
            emails: user.email,
            municipalRegistration: user.municipalRegistration,
            displayName: user.displayName,
            phones: user.phones,
            addresses: user.addresses,
            createdAt: user.createdAt,
            hasUser: user.hasUser,
          })
        })
        .finally(() => setLoading(false))
    }
  }
  useEffect(() => {
    refreshPersons()
  }, [personId])
  function getHasUser(has: boolean) {
    if (!has) {
      return 'Desabilitado'
    } else {
      return 'Habilitado'
    }
  }
  const refreshList = () => {
    setListIsLoading(true)
    getPersons(searchText, selectedOption?.value, selectedPage, pageLimit).then((persons) => {
      setPersons(
        persons.data.map(
          (person: any): TableRowProps => ({
            field1: person.personType,
            field2: formatCnpj(person.document),
            field3: person.name,
            field4: person.name,
            field5: formatCnpj(person.document),
            field6: person.municipalRegistration,
            field7: getHasUser(person.hasUser),
            field8: person.cib,
            modalId: 'kt_modal_user_details',
            onPersonSelected: () => {
              setPersonId(person.id)
            },
          })
        )
      )
      setItemsLength(persons.metadata.dataSize)
      setListIsLoading(false)
    })
  }
  useEffect(() => {
    refreshList()
  }, [selectedPage, itemsLength, searchText, selectedOption])

  const personsList = persons.map((e) => ({
    columns: mapContent([
      <PersonTypeLabel type={e.field1 as PersonType} />,
      e.field2,
      e.field3,
      e.field4,
      e.field5,
      e.field6,
      <BadgeActive fild={e.field7} label={e.field7} />,
      e.field8,
    ]),
    detailsColumn: [
      {
        content: <i className='fas fa-info-circle p-0'></i>,
        className: 'btn-primary',
        dataToggle: 'modal',
        dataTarget: `#${e.modalId}`,
        buttonAction: () => {
          e.onPersonSelected()
        },
      },
    ],
  }))
  async function updateUser(id: string) {
    setLoading(true)
    try {
      await putUser(id)
    } catch (err) {
      setError({message: err})
    } finally {
      refreshList()
      refreshPersons()
      setLoading(false)
    }
  }
  async function updatePersonsUsers() {
    setInfo(true)
    try {
      await putUsers()
    } catch (err) {
      setError({message: err})
    } finally {
      refreshList()
      refreshPersons()
      setInfo(false)
      setInfoFinally(true)
    }
  }
  return (
    <>
      {infoConfirmated && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '25%',
            bottom: '25%',
            left: '25%',
            right: '25%',
          }}
        >
          <InfoModel
            title='Confirmar ?'
            infoColor='warning'
            message='Tem certeza que deseja habilitar todos os usuários ?'
            button={[
              {
                label: 'Cancelar',
                onClick: () => {
                  setInfoConfirmated(false)
                },
                type: 'outline',
              },
              {
                label: 'Habilitar',
                onClick: () => {
                  setInfoConfirmated(false)
                  updatePersonsUsers()
                },
              },
            ]}
          />
        </div>
      )}
      {info && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '25%',
            bottom: '25%',
            left: '25%',
            right: '25%',
          }}
        >
          <InfoModel
            title='Aguarde ...'
            message='Essa operação pode demorar um pouco, mas fique tranquilo avisaremos quando estiver pronto'
            infoColor='info'
            button={[{label: 'ok', onClick: () => setInfo(false)}]}
          />
        </div>
      )}
      {infoFinally && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '25%',
            bottom: '25%',
            left: '25%',
            right: '25%',
          }}
        >
          <InfoModel
            title='Sucesso !'
            message='Sua operação foi concluida com sucesso'
            infoColor='success'
            button={[{label: 'ok', onClick: () => setInfoFinally(false)}]}
          />
        </div>
      )}
      <div className='position-absolute z-index-1'></div>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Proprietários</span>
          </h3>

          <div className='d-flex align-items-center'>
            <ImportButton type='person' />
            <CustomButton
              label={'Habilitar Todos'}
              onSubmit={() => setInfoConfirmated(true)}
              isLoading={info}
              disabled={info}
            />
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
            <div className='table-responsive'>
              {persons.length > 0 ? (
                <Table
                  rows={personsList}
                  headColumns={mapContent([
                    'TIPO DE PESSOA',
                    'MATRÍCULA',
                    'NOME/ RAZÃO SOCIAL',
                    'APELIDO/ NOME FANTASIA',
                    'CPF/ CNPJ',
                    'RG/ INSCRIÇÃO ESTADUAL',
                    'ACESSO',
                    'CIB',
                    'DETALHES',
                  ])}
                ></Table>
              ) : (
                <EmptyStateList />
              )}
            </div>
          </div>
        )}
        {!!persons.length && (
          <TablePagination
            onSelectedPageChanged={onSelectedPageChanged}
            selectedPage={selectedPage}
            arrayLength={itemsLength}
            maxPageItens={6}
          ></TablePagination>
        )}
      </div>
      <div className='modal fade align-items-center ' id='kt_modal_user_details' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered  modal-xl '>
          <div className='modal-content bg-light'>
            <div className='  modal-header  justify-content-center'>
              <div className=''></div>
              <div className=' rounded d-flex w-100 flex-center p-2 fw-bolder bg-white text-muted'>
                <div className=' text-center ml-3'>DETALHES</div>
              </div>

              <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
              </div>
            </div>
            {loading ? (
              <IsLoadingList />
            ) : (
              <div className='pb-10 d-flex flex-row justify-content-around'>
                <DetailsCard
                  imgUrl={toAbsoluteUrl('/media/illustrations/custom/defaultAvatar.svg')}
                  userInfo={modalCardInfo}
                  linkUrl={`/ITR/RegisterPersons/${selectedPerson?.id}`}
                />
                <div className='card shadow-sm w-500px '>
                  <div className='p-5 d-flex flex-row justify-content-between'>
                    <div className='p-3'>
                      <h3 className='card-title'>Pessoas</h3>
                      <p className='text-muted'>{selectedPerson?.name}</p>
                    </div>
                    <div className='p-3'>
                      <p className='text-muted'>Data</p>
                      <h3 className='card-title'>{formatDate(selectedPerson?.createdAt)}</h3>
                    </div>
                  </div>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('/media/illustrations/custom/admCard.svg')}
                    className='h-350px'
                  />
                  <div className='card-footer d-flex justify-content-center'>
                    {selectedPerson?.hasUser ? (
                      <BadgeActive label='Contribuinte Habilitado' fild='Habilitado'></BadgeActive>
                    ) : (
                      <div className='d-flex flex-column justify-content-center align-items-center'>
                        <CustomButton
                          isLoading={loading}
                          disabled={loading}
                          label={'Habilitar Contribuinte'}
                          onSubmit={() => updateUser(selectedPerson?.id || '')}
                        />
                        <FormError noMargin className='mt-4' status={error} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
function BadgeActive(props: {label: string; fild: string}) {
  return (
    <span className={`badge badge-${props.fild === 'Desabilitado' ? 'secondary' : 'success'}`}>
      {props.label}
    </span>
  )
}

export default function PersonConsultPage() {
  return <UserTable></UserTable>
}
