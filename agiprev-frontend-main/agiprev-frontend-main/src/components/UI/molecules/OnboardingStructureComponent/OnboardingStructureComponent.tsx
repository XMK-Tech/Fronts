import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import StepperComponent from '../../../UI/atoms/StepperComponent/StepperComponent';
import TextComponent from '../../../UI/atoms/TextComponent/TextComponent';
import {
  Grid,
  GridItem,
  Flex,
  useBreakpointValue,
  Box,
} from '@chakra-ui/react';
import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import LinkComponent from '../../atoms/LinkComponent/LinkComponent';

export type OnboardingStructureProps = {
  children: React.ReactNode;
  titles: string[];
  subtitles: string[];
  steps: string[];
  currentStep: number;
  nextStepDisabled?: boolean;
  step: number;
  setStep?: any;
  finishButtonLabel?: string;
  onSubmit: () => void;
};

export default function OnboardingStructureComponent(
  props: OnboardingStructureProps
) {
  const colSpanOnBoarding = useBreakpointValue({ base: 12, sm: 10 });
  const colSpanStepper = useBreakpointValue({ base: 12, sm: 2 });
  return (
    <Grid templateColumns="repeat(12, 2fr)">
      <GridItem
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'space-between'}
        colSpan={colSpanOnBoarding}
        height={{ base: '100%', sm: '100vh' }}
        padding={'20px'}
      >
        <Flex flexDirection={'column'}>
          <TitleTextComponent>
            {props.titles[props.currentStep]}
          </TitleTextComponent>
          <TitleTextComponent subTitle>
            {props.subtitles[props.currentStep]}
          </TitleTextComponent>
        </Flex>

        <Flex minH={450} flexDirection={'column'}>
          {props.children}
        </Flex>
        <Flex justifyContent={'end'}>
          {props.step > 0 && (
            <ButtonComponent
              colorScheme="brand"
              variant="outline"
              onSubmit={() => props.setStep(props.step - 1)}
            >
              Anterior
            </ButtonComponent>
          )}
          {props.step < props.steps.length - 1 && (
            <ButtonComponent
              margin={'0 0 0 20px'}
              colorScheme="brand"
              disabled={props.nextStepDisabled}
              variant="solid"
              onSubmit={() => props.setStep(props.step + 1)}
            >
              Proximo
            </ButtonComponent>
          )}
          {props.step === props.steps.length - 1 && (
            <ButtonComponent
              margin={'0 0 0 20px'}
              colorScheme="brand"
              variant="solid"
              disabled={props.nextStepDisabled}
              onSubmit={() => props.onSubmit()}
            >
              {props.finishButtonLabel || 'Enviar'}
            </ButtonComponent>
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={colSpanStepper} height="100vh">
        <Flex
          direction={'column'}
          justifyContent={'space-between'}
          height="100%"
          backgroundColor={'brand.500'}
          padding={5}
        >
          <Box>
            <TitleTextComponent mb={10} mt={10} color="white">
              Estamos Quase lá
            </TitleTextComponent>
            <StepperComponent
              currentStep={props.currentStep}
              steps={props.steps}
            />
          </Box>

          <TextComponent color={'white'}>
            Precisa de ajuda?{' '}
            <LinkComponent to="/login">Contato com suporte</LinkComponent>
          </TextComponent>
        </Flex>
      </GridItem>
    </Grid>
  );
}
