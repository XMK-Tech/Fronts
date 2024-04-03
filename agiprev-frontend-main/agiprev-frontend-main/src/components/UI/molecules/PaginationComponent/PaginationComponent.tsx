import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Tag } from '@chakra-ui/react';

export const usePagination = (pageSize: number = 6) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [size, setSize] = useState<number>(0);
  return {
    selectedPage,
    setSelectedPage,
    size,
    setSize,
    pageSize,
  };
};

export const PaginationComponent: React.FC<{
  onSelectedPageChanged: (page: number) => void;
  selectedPage: number;
  arrayLength: number;
  maxPageItens: number;
}> = (props) => {
  //TODO: Passar como PROP, a página selecionada, um callback para fazer a alteração da página selecionada e os items

  function getInitialPages(pages: number[], selectedPage: number) {
    if (selectedPage === 1 || selectedPage > pages.length - 3) {
      return pages.slice(0, 3);
    }
    return pages.slice(selectedPage - 2, selectedPage + 1);
  }
  function getFinalPages(pages: number[], selectedPage: number) {
    if (selectedPage === pages.length - 2) {
      return pages.slice(selectedPage - 2, pages.length - 1);
    }
    return pages.slice(pages.length - 3, pages.length + 1);
  }

  const numberOfPages: number = Math.ceil(
    props.arrayLength / props.maxPageItens
  );

  let pages: number[] = [];
  for (var i = 1; i <= numberOfPages; i++) {
    pages.push(i);
  }
  const setSelected = (e: any, i: number) => {
    e.preventDefault();
    props.onSelectedPageChanged(i);
  };

  return (
    <ul className=" m-4 justify-content-end align-items-center pagination pagination-outline">
      <li
        className={`page-item previous m-1 ${
          props.selectedPage === 1 && ' disabled'
        }`}
      >
        <ArrowLeftIcon
          cursor={'pointer'}
          color={'gray.500'}
          fontSize={12}
          onClick={(e) => setSelected(e, 1)}
        />
      </li>
      <li
        className={`page-item previous m-1 ${
          props.selectedPage === 1 && ' disabled'
        }`}
      >
        <ChevronLeftIcon
          cursor={'pointer'}
          color={'gray.500'}
          fontSize={22}
          onClick={(e) =>
            props.selectedPage > 1 && setSelected(e, props.selectedPage - 1)
          }
        />
      </li>
      {pages.length < 6 ? (
        <>
          {pages.map((i, index) => (
            <Tag
              cursor={'pointer'}
              key={index}
              margin={1}
              onClick={(e) => setSelected(e, i)}
              size={'lg'}
              variant={props.selectedPage === i ? 'solid' : ''}
              colorScheme="brand"
            >
              {i}
            </Tag>
          ))}
        </>
      ) : (
        <>
          {getInitialPages(pages, props.selectedPage).map((i, index) => (
            <li
              key={index}
              className={`page-item  m-1 ${
                props.selectedPage === i && 'active'
              }`}
            >
              <Tag
                cursor={'pointer'}
                key={index}
                margin={1}
                onClick={(e) => setSelected(e, i)}
                size={'lg'}
                variant={props.selectedPage === i ? 'solid' : ''}
                colorScheme="brand"
              >
                {i}
              </Tag>
            </li>
          ))}
          {pages.length + props.selectedPage <= 6 || (
            <li
              className={`page-item  m-1 ${
                props.selectedPage === i && 'active'
              }`}
            >
              <span>...</span>
            </li>
          )}
          {getFinalPages(pages, props.selectedPage).map((i, index) => (
            <li
              key={index}
              className={`page-item  m-1 ${
                props.selectedPage === i && 'active'
              }`}
            >
              <Tag
                cursor={'pointer'}
                margin={1}
                onClick={(e) => setSelected(e, i)}
                size={'lg'}
                variant={props.selectedPage === i ? 'solid' : ''}
                colorScheme="brand"
              >
                {i}
              </Tag>
            </li>
          ))}
        </>
      )}
      <li
        className={`page-item next m-1 ${
          props.selectedPage === pages.length && ' disabled'
        }`}
      >
        <ChevronRightIcon
          cursor={'pointer'}
          color={'gray.500'}
          fontSize={22}
          onClick={(e) =>
            props.selectedPage < numberOfPages &&
            setSelected(e, props.selectedPage + 1)
          }
        />
      </li>
      <li
        className={`page-item next m-1 ${
          props.selectedPage === pages.length && ' disabled'
        }`}
      >
        <ArrowRightIcon
          cursor={'pointer'}
          color={'gray.500'}
          fontSize={12}
          onClick={(e) => setSelected(e, pages.length)}
        />
      </li>
    </ul>
  );
};
