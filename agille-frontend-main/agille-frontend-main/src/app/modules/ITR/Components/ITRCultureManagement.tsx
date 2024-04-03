import {RegisterFormModelInput} from '../../../../components/RegisterFormModel'
import {masks} from '../../../components/Form/FormInput'
import {CultureTypeApi} from '../../../services/CultureTypeApi'

type ITRCultureTypeProps = {
  title: string
  inputAgricultureList?: CultureTypeApi[]
  inputFishFarmList?: CultureTypeApi[]
  getFieldProps: (name: string) => any
}

export default function ITRAgricultureManagement(props: ITRCultureTypeProps) {
  return (
    <div className='mb-5'>
      <div className='mb-5'>
        <strong className='fs-5'>{props.title}</strong>
      </div>
      <div className='d-flex flex-wrap'>
        {props.inputAgricultureList?.map((e) => (
          <div style={{marginRight: 20}}>
            <RegisterFormModelInput
              mask={masks.number}
              label={e.name + ' - Área de plantio m2'}
              placeholder='10m2'
              fieldProps={props.getFieldProps(`agricultura.${e.name}`)}
              touched={undefined}
              errors={undefined}
              type='text'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ITRFishFarmManagement(props: ITRCultureTypeProps) {
  return (
    <div className='mb-5'>
      <div className='mb-5'>
        <strong className='fs-5'>{props.title}</strong>
      </div>
      <div className='d-flex flex-column'>
        {props.inputFishFarmList?.map((e) => (
          <>
            <div className='mt-2'>
              <span className='text-gray'>Espécie {e.name}</span>
            </div>
            <div className='d-flex flex-row' style={{marginRight: 20}}>
              <div style={{marginRight: 20}}>
                <RegisterFormModelInput
                  mask={masks.number}
                  label={'Qtd de Indiviuduos'}
                  placeholder='19'
                  fieldProps={props.getFieldProps(`piscicultura.${e.name}.count`)}
                  touched={undefined}
                  errors={undefined}
                  type='text'
                />
              </div>
              <div>
                <RegisterFormModelInput
                  mask={masks.number}
                  label={'Qtd Lamina dagua'}
                  placeholder='2000'
                  fieldProps={props.getFieldProps(`piscicultura.${e.name}.area`)}
                  touched={undefined}
                  errors={undefined}
                  type='text'
                />
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}
