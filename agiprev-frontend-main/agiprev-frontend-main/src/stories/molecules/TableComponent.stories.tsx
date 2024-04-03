import { Box, GlobalStyle, Stack } from '@chakra-ui/react';
import { Story } from '@storybook/react';
import { FaEye } from 'react-icons/fa';
import AvatarLabelComponent from '../../components/UI/atoms/AvatarLabelComponent/AvatarLabelComponent';
import ButtonComponent from '../../components/UI/atoms/ButtonComponent/ButtonComponent';
import TextComponent from '../../components/UI/atoms/TextComponent/TextComponent';
import TableComponent, {
  TableComponentProps,
} from '../../components/UI/molecules/TableComponent/TableComponent';

export default {
  component: TableComponent,
  decorators: [
    (Story: Story) => (
      <>
        <GlobalStyle />
        <Story />
      </>
    ),
  ],
  title: 'Molecules/TableComponent',
};
const listPerson = [
  {
    name: 'João da Silva',
    document: '123.456.789-10',
    tel: '(11) 12345-6789',
    date: '01/01/2021',
    status: 'Ativo',
  },
  {
    name: 'João da Silva',
    document: '123.456.789-10',
    tel: '(11) 12345-6789',
    date: '01/01/2021',
    status: 'Ativo',
  },
  {
    name: 'João da Silva',
    document: '123.456.789-10',
    tel: '(11) 12345-6789',
    date: '01/01/2021',
    status: 'Ativo',
  },
];

const Template: Story<TableComponentProps> = (args) => (
  <TableComponent {...args} />
);

export const Table = Template.bind({});
Table.args = {
  ItemsHeader: [
    { item: 'Nome' },
    { item: 'Documento' },
    { item: 'Email' },
    { item: 'Telefone' },
    { item: 'Data' },
    { item: 'Ação' },
  ],
  data: listPerson.map((e: any) => ({
    items: [
      <AvatarLabelComponent label={e.name} />,
      e.document,
      'email@gmail.com',
      '(31) 9 9999-9999',
      e.date,
      <ButtonComponent leftIcon={<FaEye />} onSubmit={() => {}}>
        Detalhes
      </ButtonComponent>,
    ],
  })),
};

export const TableWithDrawer = Template.bind({});
TableWithDrawer.args = {
  ItemsHeader: [
    { item: 'Nome' },
    { item: 'Documento' },
    { item: 'Email' },
    { item: 'Telefone' },
    { item: 'Data' },
    { item: '' },
  ],
  data: listPerson.map((e: any) => ({
    items: [
      <AvatarLabelComponent label={e.name} />,
      e.document,
      'email@gmail.com',
      '(31) 9 9999-9999',
      e.date,
    ],
    drawer: (
      <Box>
        <Stack direction={'row'} spacing={'30px'}>
          <TextComponent>{e.status}</TextComponent>
          <AvatarLabelComponent label={e.name} />
          <AvatarLabelComponent label={e.name} />
          <AvatarLabelComponent label={e.name} />
        </Stack>
      </Box>
    ),
  })),
};
