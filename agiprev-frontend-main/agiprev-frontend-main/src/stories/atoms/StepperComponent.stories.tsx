import { Story } from '@storybook/react';
import StepperComponent, {
  StepperProps,
} from '../../components/UI/atoms/StepperComponent/StepperComponent';

export default {
  component: StepperComponent,
  title: 'Atoms/StepperComponent',
};

const Template: Story<StepperProps> = (args) => <StepperComponent {...args} />;

export const Stepper = Template.bind({});
Stepper.args = {
  steps: ['Step 1', 'Step 2', 'Step 3'],
  currentStep: 2,
};
