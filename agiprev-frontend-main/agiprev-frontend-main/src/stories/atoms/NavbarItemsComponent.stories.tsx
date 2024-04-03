import { Story } from '@storybook/react';
import { FaAmazon, FaAngular, FaAt, FaAtom } from 'react-icons/fa';
import NavbarItemsComponent, {
  NavbarItemsProps,
} from '../../components/UI/atoms/NavbarItemsComponent/NavbarItemsComponent';

export default {
  component: NavbarItemsComponent,
  title: 'Atoms/NavbarItemsComponent',
};

const Template: Story<NavbarItemsProps> = (args) => (
  <NavbarItemsComponent {...args} />
);

export const NavbarItems = Template.bind({});
NavbarItems.args = {
  buttons: [
    {
      icon: <FaAngular />,
      onSubmit: () => {},
    },
    {
      icon: <FaAt />,
      onSubmit: () => {},
    },
    {
      icon: <FaAtom />,
      onSubmit: () => {},
    },
    {
      icon: <FaAmazon />,
      onSubmit: () => {},
    },
  ],
};
