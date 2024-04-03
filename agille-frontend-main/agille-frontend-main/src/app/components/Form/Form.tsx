import {FormikProps} from 'formik'
import {FormColumn, FormColumnProps} from './FormColumn'

type FormProps = {
  form: FormikProps<any>
  footer?: React.ReactNode
  columns?: FormColumnProps[]
  content?: {
    className: string
    field: React.ReactNode
  }[]
}

export default function Form(props: FormProps) {
  return (
    <form onSubmit={props.form?.handleSubmit}>
      <div className=' shadow rounded bg-light '>
        <div className='p-10'>
          <div className='d-flex flex-row justify-content-between'>
            {props.columns?.map((field, index) => (
              <FormColumn
                key={index}
                className={field.className}
                form={props.form}
                inputs={field.inputs}
                content={field.content}
              />
            ))}
            {props.content?.map((field, index) => (
              <div
                key={index}
                className={`px-4 flex-grow-1 d-flex flex-column ${field.className || ''}`}
              >
                {field.field}
              </div>
            ))}
          </div>
        </div>
      </div>
      {!!props.footer && props.footer}
    </form>
  )
}
