import {
  Flex,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
type CardPercentageComponentProps = {
  title: string;
  value: string | number;
  percentage?: string | number;
  percentageLabel?: string;
  type?: 'increase' | 'decrease';
  cardWidth?: string | number;
};
export default function CardPercentageComponent(
  props: CardPercentageComponentProps
) {
  return (
    <Flex
      w={props.cardWidth}
      borderRadius={8}
      backgroundColor={'brand.500'}
      padding={4}
    >
      <StatGroup color={'white'}>
        <Stat>
          <StatLabel mb={4}>{props.title}</StatLabel>
          <StatNumber>{props.value}</StatNumber>
          <StatHelpText mt={2}>
            {props.type && <StatArrow type={props.type} />}
            {props.percentage}
            {props.percentageLabel}
          </StatHelpText>
        </Stat>
      </StatGroup>
    </Flex>
  );
}
