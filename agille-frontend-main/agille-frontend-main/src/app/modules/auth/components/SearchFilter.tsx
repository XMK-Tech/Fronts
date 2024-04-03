import React from 'react'

type SearchFilterProps = {
  width?: string
}

export default function SearchFilter(props: SearchFilterProps) {
  return (
    <>
      <div className='d-flex '>
        <div className='d-flex align-items-center position-relative my-1'>
          <span className='svg-icon svg-icon-1 position-absolute ms-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <rect
                opacity='0.5'
                x='17.0365'
                y='15.1223'
                width='8.15546'
                height='2'
                rx='1'
                transform='rotate(45 17.0365 15.1223)'
                fill='black'
              ></rect>
              <path
                d='M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z'
                fill='black'
              ></path>
            </svg>
          </span>
          <input
            type='text'
            data-kt-user-table-filter='search'
            className={`form-control form-control-solid ${
              props.width ? props.width : 'w-300px'
            } ps-14`}
            placeholder='Buscar'
          ></input>
          <button
            type='button'
            className='btn btn-sm btn-light-primary ms-3 show-menu-dropdown'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <span className='svg-icon svg-icon-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z'
                  fill='black'
                ></path>
              </svg>
              <span>Filtro</span>
            </span>
          </button>

          <div
            className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
            data-kt-menu='true'
            data-popper-placement='bottom-end'
          >
            <div className='px-7 py-5'>
              <div className='fs-5 text-dark fw-bolder'>Opções De Filtro</div>
            </div>

            <div className='separator border-gray-200'></div>
            <div className='px-7 py-5' data-kt-user-table-filter='form'>
              <div className='mb-10'>
                <select
                  className='form-select form-select-solid fw-bolder select2-hidden-accessible'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  data-kt-user-table-filter='role'
                  data-hide-search='true'
                  data-select2-id='select2-data-7-g2mc'
                  aria-hidden='true'
                >
                  <option data-select2-id='select2-data-9-d3ho'>Selecione o tipo do filtro</option>
                  <option value='Administrator'>Nome</option>
                  <option value='Analyst'>CPF</option>
                  <option value='Developer'>Município</option>
                  <option value='Support'>Email</option>
                </select>
              </div>

              <div className='d-flex justify-content-end'>
                <button
                  type='reset'
                  className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='reset'
                >
                  Limpar
                </button>
                <button
                  type='submit'
                  className='btn btn-primary fw-bold px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='filter'
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
