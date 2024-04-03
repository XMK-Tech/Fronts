import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TextProps as ChakraTextProps,
} from '@chakra-ui/react';
import React from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortDown,
  FaSortUp,
} from 'react-icons/fa';
import { SortDirection } from '../../../../services/PhysicalPersonService';

import EmptyStateComponent from '../../atoms/EmptyState/EmptyStateComponente';
import { useIsWeb } from '../../../../hooks/useIsWeb';

type TableHeaderProps = {
  itemsHeader: { item: React.ReactNode; sort?: string }[];
  onSortingChanged?: (name: string, direction: SortDirection) => void;
  sorting?: { sortColumn: string; direction: SortDirection };
  justifyContent?: string;
  centered?: boolean;
  fontSize?: ChakraTextProps['fontSize'];
  contentFontSize?: ChakraTextProps['fontSize'];
};

function TableHeader(props: TableHeaderProps) {
  const isAsc = props.sorting?.direction === 'asc';
  function getIcon(sort?: string) {
    if (sort === (null || undefined)) return null;
    if (props.sorting?.sortColumn !== sort) return <FaSort />;
    return isAsc ? <FaSortUp /> : <FaSortDown />;
  }
  function getDirection(sort?: string) {
    if (props.sorting?.sortColumn !== sort) return 'asc';
    return isAsc ? 'desc' : 'asc';
  }
  return (
    <Thead backgroundColor={'brand.500'}>
      <Tr>
        {props.itemsHeader.map((item, i) => (
          <Th
            textAlign={props.centered ? 'center' : undefined}
            cursor={item.sort && 'pointer'}
            fontSize={props.fontSize}
            key={i}
            p={4}
            color={'white'}
            onClick={() => {
              if (item.sort) {
                props.onSortingChanged?.(item.sort, getDirection(item.sort));
              }
            }}
          >
            <Flex
              width={'100%'}
              alignItems={'center'}
              justifyContent={props.centered ? 'center' : 'left'}
            >
              {getIcon(item.sort)}
              {item.item}
            </Flex>
          </Th>
        ))}
      </Tr>
    </Thead>
  );
}

function SkeletonRow({ width, columns }: { width: string; columns: number }) {
  return (
    <Box as="tr">
      {Array.from(Array(columns), (e, i) => (
        <Td key={i}>
          <Skeleton isLoaded={false} height="10px" w={width} my={4} />
        </Td>
      ))}
    </Box>
  );
}
function SkeletonTable({ columns }: { columns: number }) {
  return (
    <>
      <SkeletonRow columns={columns} width="100px" />
      <SkeletonRow columns={columns} width="100px" />
      <SkeletonRow columns={columns} width="100px" />
      <SkeletonRow columns={columns} width="100px" />
      <SkeletonRow columns={columns} width="100px" />
      <SkeletonRow columns={columns} width="100px" />
    </>
  );
}

type TableBodyProps = {
  data: TableComponentDataProps[];
  isLoading: boolean;
  columns: number;
  centered?: boolean;
  contentFontSize?: ChakraTextProps['fontSize'];
};
function TableBody(props: TableBodyProps) {
  const [drawerActiveIndexes, setDrawerActiveIndexes] = React.useState<
    number[]
  >([]);

  function drawerActive(index: number) {
    return drawerActiveIndexes.includes(index);
  }
  return (
    <Tbody>
      {props.isLoading ? (
        <SkeletonTable columns={props.columns} />
      ) : (
        props.data.map((data, index) => (
          <React.Fragment key={index}>
            <Tr>
              {data.items.map((e, i) => (
                <Td
                  key={i}
                  fontSize={props.contentFontSize}
                  whiteSpace={'break-spaces'}
                  textAlign={props.centered ? 'center' : undefined}
                >
                  {e}
                </Td>
              ))}
              {data.drawer && (
                <Td
                  textAlign={props.centered ? 'center' : undefined}
                  fontSize={props.contentFontSize}
                >
                  <IconButton
                    aria-label="Open drawer"
                    variant={'guost'}
                    ml={'20px'}
                    icon={
                      drawerActive(index) ? <FaChevronUp /> : <FaChevronDown />
                    }
                    onClick={() => {
                      setDrawerActiveIndexes(
                        drawerActive(index)
                          ? drawerActiveIndexes.filter(
                              (active) => active !== index
                            )
                          : [...drawerActiveIndexes, index]
                      );
                    }}
                  />
                </Td>
              )}
            </Tr>
            {data.drawer && drawerActive(index) && (
              <Tr>
                <Td
                  fontSize={props.contentFontSize}
                  textAlign={props.centered ? 'center' : undefined}
                  colSpan={100}
                >
                  {data.drawer}
                </Td>
              </Tr>
            )}
          </React.Fragment>
        ))
      )}
    </Tbody>
  );
}

export type TableComponentDataProps = {
  items: React.ReactNode[];
  // transforms last item in drawer
  drawer?: React.ReactNode;
};

export type TableComponentHeaderProps = {
  item: React.ReactNode;
  sort?: string;
  hideOnMobile?: boolean;
};

export type TableComponentProps = {
  ItemsHeader: TableComponentHeaderProps[];
  data: TableComponentDataProps[];
  emptyState?: boolean;
  isLoading: boolean;
  onSortingChanged?: (sortColumn: string, direction: SortDirection) => void;
  sorting?: { sortColumn: string; direction: SortDirection };
  justifyContent?: string;
  centered?: boolean;
  fontSize?: ChakraTextProps['fontSize'];
  contentFontSize?: ChakraTextProps['fontSize'];
};
export default function TableComponent(props: TableComponentProps) {
  const isWeb = useIsWeb();

  const ItemsHeader = props.ItemsHeader.filter(
    (item) => isWeb || item.hideOnMobile !== true
  );

  return (
    <TableContainer borderRadius={8}>
      <Table
        variant="unstyled"
        colorScheme={'brand'}
        sx={{ tableLayout: 'fixed' }}
      >
        <TableHeader
          justifyContent={props.justifyContent}
          itemsHeader={ItemsHeader}
          onSortingChanged={props.onSortingChanged}
          sorting={props.sorting}
          centered={props.centered}
          fontSize={props.fontSize}
        />
        <TableBody
          centered={props.centered}
          data={props.data}
          isLoading={props.isLoading}
          contentFontSize={props.contentFontSize}
          columns={isWeb ? props.ItemsHeader.length : ItemsHeader.length}
        />
      </Table>
      {props.emptyState && (
        <Flex justifyContent={'center'}>
          <EmptyStateComponent />
        </Flex>
      )}
    </TableContainer>
  );
}
