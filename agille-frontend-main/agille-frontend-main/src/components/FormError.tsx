export function FormError({
  status,
  noMargin,
  className,
}: {
  status: any
  noMargin?: boolean
  className?: string
}) {
  return (
    <>
      {status ? (
        <div className={`${noMargin ? '' : 'mb-lg-15'} alert alert-danger ${className || ''}`}>
          <div className='alert-text font-weight-bold'>{status.message}</div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
