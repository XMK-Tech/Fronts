import {ChangeEventHandler} from 'react'
import {CustomButton} from '../../../components/CustomButton/CustomButton'
import {CultureTypeApi} from '../../../services/CultureTypeApi'
import CheckBoxITem from './CheckBoxItem'

type ITRCultureTypeProps = {
  title: string
  defaultCheckBoxList?: CultureTypeApi[]
  checkBoxList?: CultureTypeApi[]
  inputValue?: string
  onChangeInput?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  placeholder?: string
  onSubmitButton?: () => void
  isLoadingButton?: boolean
  disabladButton?: boolean
  getFieldProps: (name: string) => any
  fieldNamePrefix: string
}

export default function ITRCultureType(props: ITRCultureTypeProps) {
  return (
    <div className='mb-5'>
      <div className='mb-5'>
        <strong className='fs-5'>{props.title}</strong>
      </div>
      {props.defaultCheckBoxList && (
        <div>
          <p>Padrões</p>
          <div className='w-500px d-flex flex-wrap'>
            {props.defaultCheckBoxList?.map((e) => (
              <div key={e.id} className='mb-5' style={{marginRight: 10}}>
                <CheckBoxITem disabled removeMx label={e.name} defaultChecked />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p>Adicionados</p>
        <div className='w-500px d-flex flex-wrap'>
          {props.checkBoxList && props.checkBoxList > [] ? (
            props.checkBoxList?.map((e) => (
              <div key={e.id} className='mb-5' style={{marginRight: 10}}>
                <CheckBoxITem
                  fieldProps={props.getFieldProps(`${props.fieldNamePrefix}.${e.name}`)}
                  removeMx
                  label={e.name}
                  defaultChecked={e.isChecked}
                />
              </div>
            ))
          ) : (
            <strong className='fs-5 mb-5'>Sem adições</strong>
          )}
        </div>
      </div>
      <div className='w-450px d-flex '>
        <input
          value={props.inputValue}
          onChange={props.onChangeInput}
          placeholder={props.placeholder}
          className='shadow form-control'
          style={{marginRight: 10}}
        />
        <CustomButton
          disabled={props.disabladButton}
          isLoading={props.isLoadingButton ?? false}
          onSubmit={props.onSubmitButton ? props.onSubmitButton : () => {}}
          label={'Inserir'}
        />
      </div>
    </div>
  )
}
