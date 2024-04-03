import {Link} from 'react-router-dom'

type CustomButtonProps = {
  isLoading: boolean
  onSubmit: () => void
  label: string
  disabled?: boolean
  href?: string
  link?: string
  margin?: string | undefined
  target?: string
}

export function CustomButton(props: CustomButtonProps) {
  return (
    <>
      {props.link ? (
        <Link to={props.link || ''}>
          <ButtonBody {...props} />
        </Link>
      ) : (
        <a href={props.href} target={props.target}>
          <ButtonBody {...props} />
        </a>
      )}
    </>
  )
}
function ButtonBody(props: CustomButtonProps) {
  return (
    <div
      onClick={() => !props.isLoading && props.onSubmit()}
      className={`btn btn-primary ${!props.margin && 'me-10'} ${props.disabled && 'disabled'}`}
    >
      {props.label}
      {props.isLoading && <span className=' ms-2 spinner-border spinner-border-sm'></span>}
    </div>
  )
}
