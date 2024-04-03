import { Story } from '@storybook/react';
import { FaAmazon, FaAngular, FaAt, FaAtom } from 'react-icons/fa';
import { NavbarItemsProps } from '../../components/UI/atoms/NavbarItemsComponent/NavbarItemsComponent';
import NavbarComponent from '../../components/UI/molecules/NavbarComponent/NavbarComponent';

export default {
  component: NavbarComponent,
  title: 'Molecules/NavbarComponent',
};

const Template: Story<NavbarItemsProps> = (args) => (
  <NavbarComponent {...args} />
);

export const Navbar = Template.bind({});
Navbar.args = {
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
