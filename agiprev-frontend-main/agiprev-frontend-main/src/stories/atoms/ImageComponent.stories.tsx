import { Story } from '@storybook/react';
import ImageComponent, {
  ImageProps,
} from '../../components/UI/atoms/ImageComponent/ImageComponent';

export default {
  component: ImageComponent,
  title: 'Atoms/ImageComponent',
};

const Template: Story<ImageProps> = (args) => <ImageComponent {...args} />;

export const Image = Template.bind({});
Image.args = {
  src: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
};
