import { Story } from '@storybook/react';
import NotificationMenuComponent, {
  NotificationMenuProps,
} from '../../components/UI/molecules/NotificationMenuComponent/NotificationMenuComponent';

export default {
  component: NotificationMenuComponent,
  title: 'Molecules/NotificationMenuComponent',
};

const Template: Story<NotificationMenuProps> = (args) => (
  <NotificationMenuComponent {...args} />
);

export const NotificationMenu = Template.bind({});
NotificationMenu.args = {
  items: [
    {
      person: 'Raphael Moreira',
      subject: 'Produto da Sprint Entregue',
      time: '9:30 am',
      action: () => {},
    },
    {
      person: 'Rander Gabriel',
      subject: 'Reunião com cliente marcada',
      time: '10:30 am',
      action: () => {},
    },
    {
      person: 'David Mota',
      subject: 'Problemas com Front',
      time: '11:30 am',
      action: () => {},
    },
    {
      person: 'Erik Neves',
      subject: 'Problemas com Back',
      time: '9:00 am',
      action: () => {},
    },
    {
      person: 'Vinicius X',
      subject: 'Testes em andamento',
      time: '9:00 am',
      action: () => {},
    },
  ],
};
