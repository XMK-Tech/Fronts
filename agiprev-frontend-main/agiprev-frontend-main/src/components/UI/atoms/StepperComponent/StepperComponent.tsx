import { Box, Flex, Tag } from '@chakra-ui/react';

export type StepperProps = {
  steps: string[];
  currentStep: number;
};

export default function StepperComponent(props: StepperProps) {
  return (
    <>
      {props.steps.map((step, index) => {
        const active = index === props.currentStep;
        return (
          <Flex
            direction={`row`}
            key={index}
            padding={2}
            justifyContent={`flex-start`}
          >
            <Box position={'relative'}>
              <Box
                borderRadius={'100%'}
                border={'1px solid'}
                borderColor={active ? 'white' : 'brand.200'}
                backgroundColor={active ? 'white' : 'brand.200'}
                marginLeft={active ? '0px' : '2px'}
                width={active ? '11px' : '7px'}
                height={active ? '11px' : '7px'}
                display={'inline-block'}
              />
              {props.steps.length - 1 !== index && (
                <Box
                  className="line"
                  top={'18px'}
                  left={'5px'}
                  height={'150%'}
                  position={'absolute'}
                  borderLeft={'1px solid'}
                  borderColor={'brand.200'}
                />
              )}
            </Box>

            <Box
              color={active ? 'white' : 'brand.200'}
              display={'inline-block'}
              marginLeft={6}
              fontWeight={active ? '600' : '400'}
            >
              {step}
              {index === props.currentStep && (
                <Tag
                  backgroundColor={'white'}
                  color={'brand.500'}
                  marginLeft={'5px'}
                  fontSize={'14px'}
                >
                  {props.currentStep + 1} de {props.steps.length}
                </Tag>
              )}
            </Box>
          </Flex>
        );
      })}
    </>
  );
}
