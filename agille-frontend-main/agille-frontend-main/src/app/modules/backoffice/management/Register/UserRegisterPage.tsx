import {useFormik} from 'formik'
import {FormikProps} from 'formik/dist/types'
import React, {useEffect, useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {useHistory, useParams} from 'react-router-dom'
import {RootState} from '../../../../../setup'
import * as Yup from 'yup'
import {toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {
  createBackOfficeAdminUser,
  getUser,
  updateBackOfficeAdminUser,
} from '../../../../services/UsersApi'
import {RegisterFormImgColumn} from '../../../admin/management/Register/AdminRegisterPage'

import {
  RegisterFormModel,
  RegisterFormModelColumn,
  RegisterFormModelInput,
  useCities,
  useStates,
} from '../../../../../components/RegisterFormModel'
import {SelectInput} from '../../../../../components/SelectInput'
import {Franchise} from '../../../auth/redux/AuthTypes'
import {masks} from '../../../../components/Form/FormInput'

const userRegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Nesecário inserir o nome')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Nome'),
  document: Yup.string().required('Necessário inserir CPF'),
  email: Yup.string().required('Necessário inserir E-mail'),
  street: Yup.string()
    .required('Necessário inserir Endereço')
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Endereço'),
  uf: Yup.string().required('Necessário escolher UF'),
  number: Yup.string().max(50, 'Máximo de 50 caracteres').required('Necessário inserir Número'),
  neighborhood: Yup.string()
    .min(3, 'Mínimo de 3 caracteres')
    .max(50, 'Máximo de 50 caracteres')
    .required('Necessário inserir Bairro'),
  city: Yup.string().required('Necessário escolher Município'),
  phone: Yup.string().required('Necessário inserir Telefone'),
  zipcode: Yup.string().required('Necessário inserir CEP'),
  secondaryPhone: Yup.string().required('Necessário inserir Telefone'),
})
const defaultInitialValues = {
  fullName: '',
  document: '',
  email: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  uf: '',
  country: '',
  zipcode: '',
  phone: '',
  secondaryPhone: '',
}

type ValueType = typeof defaultInitialValues
const UserTable: React.FC<{}> = () => {
  const [initialValues, setInitialValues] = React.useState(defaultInitialValues)
  const history = useHistory()
  const {id} = useParams<{id: string}>()
  const franchiseSelected = useSelector<RootState>(
    ({auth}) => auth.selectedFranchise,
    shallowEqual
  ) as Franchise

  useEffect(() => {
    if (id) {
      getUser(id, 6).then(({data: user}) => {
        setInitialValues({
          fullName: user.fullname,
          document: user.document,
          email: user.email,
          street: user?.address?.street,
          number: user?.address?.number,
          neighborhood: user?.address?.district,
          city: user?.address?.cityId,
          uf: user?.address?.stateId,
          country: user.country,
          zipcode: user?.address?.zipcode,
          phone: user.phoneNumber,
          secondaryPhone: user.secondaryPhoneNumber,
        })
      })
    }
  }, [id])
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userRegisterSchema,

    enableReinitialize: true,
    onSubmit: async (values) => {
      if (id) {
        await updateBackOfficeAdminUser(
          id,
          {
            fullName: values.fullName,
            email: values.email,
            document: values.document,
            phoneNumber: values.phone,
            secondaryPhoneNumber: values.secondaryPhone,
            username: values.email,
            address: {
              street: values.street,
              district: values.neighborhood,
              complement: '',
              zipcode: values.zipcode,
              type: 1,
              cityId: values.city,
              number: values.number,
            },
          },
          franchiseSelected
        )
      } else {
        createBackOfficeAdminUser(
          {
            fullName: values.fullName,
            email: values.email,
            document: values.document,
            phoneNumber: values.phone,
            secondaryPhoneNumber: values.secondaryPhone,
            username: values.email,
            address: {
              street: values.street,
              district: values.neighborhood,
              complement: '',
              zipcode: values.zipcode,
              type: 1,
              cityId: values.city,
              number: values.number,
            },
          },
          franchiseSelected
        )
      }
      history.push('/backoffice/gerenciamento/consulta-usuarios')
    },
  })

  return <FormBody formik={formik} />
}

const changeResponsibility = (responsibility: boolean) => {
  if (!responsibility) {
    return 'Digitador'
  }
  return 'Digitador'
}

function FormBody({formik}: {formik: FormikProps<ValueType>}) {
  const [admPermission, setAdmPermission] = useState(false)
  const responsibility = changeResponsibility(admPermission)
  const {id} = useParams<{id: string}>()
  const states = useStates()
  const cities = useCities(formik.values.uf)

  return (
    <>
      <div className={`card`}>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              {id ? 'Editar Usuário' : 'Cadastro de Usuário'}
            </span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <RegisterFormModel
            footer={
              <div className='p-10 d-flex flex-row justify-content-around'>
                {' '}
                <button type='submit' className='btn btn-sm btn-primary'>
                  Salvar
                </button>
              </div>
            }
            onSubmit={formik.handleSubmit}
          >
            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Nome'
                id='inputName'
                placeholder='Insira o Nome'
                fieldProps={formik.getFieldProps('fullName')}
                touched={formik.touched.fullName}
                errors={formik.errors.fullName}
                type='name'
              />
              <RegisterFormModelInput
                label='CPF'
                id='inputCPF'
                placeholder='Ex.: 123456789-10'
                fieldProps={formik.getFieldProps('document')}
                touched={formik.touched.document}
                errors={formik.errors.document}
                type='document'
                mask={masks.cpf}
              />
              <RegisterFormModelInput
                label='Endereço'
                id='inputEndereco'
                placeholder='Ex.: Rua das Gaivotas'
                fieldProps={formik.getFieldProps('street')}
                touched={formik.touched.street}
                errors={formik.errors.street}
                type='street'
              />
              <SelectInput
                label='Estado'
                fieldProps={formik.getFieldProps('uf')}
                touched={formik.touched.uf}
                errors={formik.errors.uf}
                data={states}
              />
              <SelectInput
                label='Município'
                id='inputMunicipio'
                fieldProps={formik.getFieldProps('city')}
                touched={formik.touched.city}
                errors={formik.errors.city}
                data={cities}
              />
              <RegisterFormModelInput
                label='Número'
                id='inputNumber'
                placeholder='Ex.: 123'
                fieldProps={formik.getFieldProps('number')}
                touched={formik.touched.number}
                errors={formik.errors.number}
                type='number'
              />
            </RegisterFormModelColumn>

            <RegisterFormModelColumn>
              <RegisterFormModelInput
                label='Email'
                id='inputEmail'
                placeholder='exemplo@email.com'
                fieldProps={formik.getFieldProps('email')}
                touched={formik.touched.email}
                errors={formik.errors.email}
                type='email'
              />
              <RegisterFormModelInput
                label='Celular'
                id='inputCelular'
                placeholder='(31) 9 9999-9999'
                fieldProps={formik.getFieldProps('phone')}
                touched={formik.touched.phone}
                errors={formik.errors.phone}
                type='phone'
                mask={masks.phone}
              />
              <RegisterFormModelInput
                label='CEP'
                placeholder='Ex.: 30672‑772'
                fieldProps={formik.getFieldProps('zipcode')}
                touched={formik.touched.zipcode}
                errors={formik.errors.zipcode}
                type='zipcode'
                mask={masks.cep}
              />
              <RegisterFormModelInput
                label='Outro Contato'
                id='inputCelular2'
                placeholder='(31) 9 9999-9999'
                fieldProps={formik.getFieldProps('secondaryPhone')}
                touched={formik.touched.secondaryPhone}
                errors={formik.errors.secondaryPhone}
                type='secondaryPhone'
                mask={masks.phone}
              />
              <RegisterFormModelInput
                label='Bairro'
                id='inputBairro'
                placeholder='Ex.: Vila Clóris'
                fieldProps={formik.getFieldProps('neighborhood')}
                touched={formik.touched.neighborhood}
                errors={formik.errors.neighborhood}
                type='neighborhood'
              />
              <label className='mt-13 form-check form-switch form-check-custom form-check-solid'>
                <input
                  onChange={() => {
                    setAdmPermission(!admPermission)
                  }}
                  className='form-check-input w-30px h-20px'
                  type='checkbox'
                  value='1'
                  checked={admPermission}
                  name='notifications'
                />
                <strong className='form-check-label fs-7'>{responsibility}</strong>
              </label>
            </RegisterFormModelColumn>

            <RegisterFormImgColumn>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/illustrations/custom/adminRegisterIllustration.svg')}
                className='img-fluid'
              />
            </RegisterFormImgColumn>
          </RegisterFormModel>
        </div>
      </div>
    </>
  )
}

function UserRegister() {
  return <UserTable />
}

export default UserRegister
