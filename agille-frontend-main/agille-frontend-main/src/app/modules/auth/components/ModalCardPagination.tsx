import React, {useState} from 'react'

export const ModalCardPagination: React.FC<{
  onSelectedPageChanged: (page: number) => void
  selectedPage: number
  arrayLength: number
  maxPageItens: number
}> = (props) => {
  //TODO: Passar como PROP, a página selecionada, um callback para fazer a alteração da página selecionada e os items

  function getInitialPages(pages: number[], selectedPage: number) {
    if (selectedPage > pages.length - 7) {
      return pages.slice(pages.length - 7, pages.length - 3)
    }
    return pages.slice(selectedPage - 1, selectedPage + 2)
  }
  function getFinalPages(pages: number[], selectedPage: number) {
    return pages.slice(pages.length - 3)
  }

  const numberOfPages: number = Math.ceil(props.arrayLength / props.maxPageItens)

  let pages: number[] = []
  for (var i = 1; i <= numberOfPages; i++) {
    pages.push(i)
  }
  const setSelected = (e: any, i: number) => {
    e.preventDefault()
    props.onSelectedPageChanged(i)
  }
  return (
    <ul className='m-5 justify-content-end pagination pagination-outline'>
      <li className={`page-item previous m-1 ${props.selectedPage == 1 && ' disabled'}`}>
        <a href='#' onClick={(e) => setSelected(e, props.selectedPage - 1)} className='page-link'>
          <i className='previous'></i>
        </a>
      </li>
      {pages.length < 7 ? (
        <>
          {pages.map((i, index) => (
            <li key={index} className={`page-item  m-1 ${props.selectedPage == i && 'active'}`}>
              <a href='#' onClick={(e) => setSelected(e, i)} className='page-link'>
                {i}
              </a>
            </li>
          ))}
        </>
      ) : (
        <>
          {getInitialPages(pages, props.selectedPage).map((i, index) => (
            <li key={index} className={`page-item  m-1 ${props.selectedPage == i && 'active'}`}>
              <a href='#' onClick={(e) => setSelected(e, i)} className='page-link'>
                {i}
              </a>
            </li>
          ))}
          {pages.length - props.selectedPage <= 6 || (
            <li className={`page-item  m-1 ${props.selectedPage == i && 'active'}`}>
              <a className='page-link'>...</a>
            </li>
          )}
          {getFinalPages(pages, props.selectedPage).map((i, index) => (
            <li key={index} className={`page-item  m-1 ${props.selectedPage == i && 'active'}`}>
              <a href='#' onClick={(e) => setSelected(e, i)} className='page-link'>
                {i}
              </a>
            </li>
          ))}
        </>
      )}
      <li className={`page-item next m-1 ${props.selectedPage == pages.length && ' disabled'}`}>
        <a href='#' className='page-link' onClick={(e) => setSelected(e, props.selectedPage + 1)}>
          <i className='next'></i>
        </a>
      </li>
    </ul>
  )
}
