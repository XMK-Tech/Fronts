import {useState} from 'react'
import {Dropdown} from 'react-bootstrap-v5'
import {CustomButton} from '../../components/CustomButton/CustomButton'

export function CustomDropdown(props: {
  onSubmit?: () => void
  buttonText: string
  submitText?: string
  title: string
  content: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)
  return (
    <Dropdown show={show}>
      <Dropdown.Toggle onClick={toggle}>
        <span>{props.buttonText}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className='p-4 w-400px my-2'>
        {props.content}
        {props.onSubmit && (
          <CustomButton
            margin='0'
            label={props.submitText ?? ''}
            isLoading={false}
            onSubmit={() => {
              props.onSubmit?.()
            }}
          />
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}
