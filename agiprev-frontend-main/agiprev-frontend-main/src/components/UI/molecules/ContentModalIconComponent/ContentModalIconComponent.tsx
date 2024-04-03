import { Alert, AlertIcon, Button, Flex } from '@chakra-ui/react';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';
import Connect from '../../../../assets/images/conectWeb.svg';
import Register from '../../../../assets/images/register.svg';
import Validate from '../../../../assets/images/validate.svg';
import Success from '../../../../assets/images/success.svg';

type ModalContentIconProps = {
  iconStatus?: 'error' | 'info' | 'warning' | 'success' | 'loading';
  customIcon?: 'connect' | 'register' | 'validate' | 'success';
  title?: string;
  subTitle?: string;
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  secondaryButton?: {
    onClick: () => void;
    label: string;
  };
  body?: React.ReactNode;
  button?: {
    onClick: () => void;
    label: string;
    disabled?: boolean;
  };
};

export function ContentModalIconComponent(props: ModalContentIconProps) {
  function renderCustomIcon(
    status: 'connect' | 'register' | 'validate' | 'success'
  ) {
    if (status === 'connect') {
      return Connect;
    }
    if (status === 'register') {
      return Register;
    }
    if (status === 'success') {
      return Success;
    }
    if (status === 'validate') {
      return Validate;
    }
  }

  return (
    <Flex flexDirection={'column'}>
      <Flex
        justifyContent={'center'}
        alignItems={props.alignItems || 'center'}
        flexDirection={'column'}
        textAlign={'center'}
        marginY={2}
      >
        {props.body || (
          <>
            <Alert
              backgroundColor={'white'}
              status={props.iconStatus}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              {props.customIcon ? (
                <Flex
                  justifyContent={'center'}
                  alignItems={'center'}
                  backgroundColor={'brand.500'}
                  width={50}
                  height={50}
                  borderRadius={'50%'}
                >
                  <ImageComponent
                    height="24px"
                    width="24px"
                    src={renderCustomIcon(props.customIcon)}
                  />
                </Flex>
              ) : (
                <AlertIcon boxSize="40px" mr={0}></AlertIcon>
              )}
            </Alert>
            <Flex>
              <TitleTextComponent>{props.title}</TitleTextComponent>
            </Flex>

            <TitleTextComponent maxW="350px" subTitle>
              {props.subTitle}
            </TitleTextComponent>
          </>
        )}
      </Flex>
      <Flex mt={8} justifyContent={'end'}>
        {props.secondaryButton && (
          <Button
            variant={'outline'}
            colorScheme={'black'}
            mr={3}
            onClick={props.secondaryButton?.onClick}
          >
            {props.secondaryButton?.label}
          </Button>
        )}
        {props.button && (
          <Button
            disabled={props.button.disabled}
            colorScheme={'brand'}
            onClick={props.button?.onClick}
          >
            {props.button?.label}
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
