import { Story } from '@storybook/react';
import TextComponent, {
  TextProps,
} from '../../components/UI/atoms/TextComponent/TextComponent';

export default {
  component: TextComponent,
  title: 'Atoms/TextComponent',
};

const Template: Story<TextProps> = (args) => <TextComponent {...args} />;

export const Text = Template.bind({});
Text.args = {
  children: 'Texto',
};
