import { Story } from '@storybook/react';
import { FaFileCode, FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import MenuButtonComponent, {
  MenuButtonComponentProps,
} from '../../components/UI/molecules/MenuButtonComponent/MenuButtonComponent';

export default {
  component: MenuButtonComponent,
  title: 'Molecules/MenuButtonComponent',
};

const Template: Story<MenuButtonComponentProps> = (args) => (
  <MenuButtonComponent {...args} />
);

export const ExportButton = Template.bind({});
ExportButton.args = {
  label: 'Exportar',
  items: [
    {
      icon: <FaFileCsv />,
      label: 'CSV',
      onClick: () => {},
    },
    {
      icon: <FaFilePdf />,
      label: 'PDF',
      onClick: () => {},
    },
    {
      icon: <FaFileCode />,
      label: 'XML',
      onClick: () => {},
    },
    {
      icon: <FaFileExcel />,
      label: 'XLSX',
      onClick: () => {},
    },
  ],
};
