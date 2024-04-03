import { Story } from '@storybook/react';
import ContractTermsComponent, {
  ContractTermsProps,
} from '../../components/UI/atoms/ContractTermsComponent/ContractTermsComponent';

export default {
  component: ContractTermsComponent,
  title: 'Atoms/ContractTermsComponent',
};

const Template: Story<ContractTermsProps> = (args) => (
  <ContractTermsComponent {...args} />
);

export const ContractTerms = Template.bind({});
ContractTerms.args = {
  terms: [
    {
      clause: `1. Clause 1`,
      paragraphs: [
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in.
    Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et.
    Amet quam placerat sem.`,
      ],
    },
    {
      clause: `2. Clause 2`,
      paragraphs: [
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in.
    Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et.
    Amet quam placerat sem.`,
      ],
    },
  ],
};
