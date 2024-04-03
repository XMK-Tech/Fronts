import React from 'react'
type Items = {
  errors: string[]
  line: number
}
type AccordionCustomProps = {
  listItems: Items[]
  title?: string
}
export default function AccordionCustom(props: AccordionCustomProps) {
  return (
    <div className='accordion my-8' id='accordionExample'>
      {props.listItems.map((e, i) => (
        <>
          <div className='accordion-item'>
            <h2 className='accordion-header'>
              <button
                className='accordion-button'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target={`#collapse${i}`}
                aria-expanded='true'
                aria-controls='collapseOne'
              >
                <div className='d-flex align-items-center justify-content-between w-100 mx-4'>
                  <div>
                    {props.title} - {e.line}
                  </div>
                  <div className='badge badge-light-danger'>{e.errors.length} Erros</div>
                </div>
              </button>
            </h2>
            <div
              id={`collapse${i}`}
              className='accordion-collapse collapse '
              aria-labelledby='headingOne'
              data-bs-parent='#accordionExample'
            >
              {e.errors.map((e) => (
                <div className='accordion-body'>{e}</div>
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  )
}
