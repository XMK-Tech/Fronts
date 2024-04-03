import ButtonComponent from '../../atoms/ButtonComponent/ButtonComponent';
import { showToast } from '../../../../utils/showToast';
import {
  AcceptPolicy,
  RejectPolicy,
  useNotAnsweredApplicationPolicy,
} from '../../../../services/ApplicationPolicyApi';
import { Flex, useToast } from '@chakra-ui/react';
import IframeComponent from '../../atoms/IframeComponent/IframeComponent';
import { getFirstIfAny } from '../../../../utils/functions/utility';
import ImageComponent from '../../atoms/ImageComponent/ImageComponent';
import allAccepted from '../../../../assets/images/allAccepted.png';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';

export default function ProfileTermsComponent() {
  const toast = useToast();
  const applicationPolicies = useNotAnsweredApplicationPolicy();
  return (
    <>
      {getFirstIfAny(applicationPolicies.data) ? (
        <>
          <TitleTextComponent subTitle>
            Termos a serem vistos e respondidos:{' '}
            {applicationPolicies.data?.length}
          </TitleTextComponent>
          {applicationPolicies.data?.[0].attachmentUrl ? (
            <IframeComponent
              src={applicationPolicies.data?.[0].attachmentUrl}
            />
          ) : (
            <TitleTextComponent subTitle>Sem pdf</TitleTextComponent>
          )}
          <Flex mt={'20px'} mb={'20px'} justifyContent={'space-around'}>
            <ButtonComponent
              colorScheme={'red'}
              onSubmit={() => {
                RejectPolicy(applicationPolicies.data?.[0].id || '')
                  .then((res) => {
                    showToast({
                      toast,
                      status: 'success',
                      title: 'Sucesso',
                      description: 'Política rejeitada com sucesso',
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                    showToast({
                      toast,
                      status: 'error',
                      title: 'Error',
                      description: 'Ocorreu um erro desconhecido',
                    });
                  });
              }}
            >
              Rejeitar
            </ButtonComponent>
            <ButtonComponent
              onSubmit={() => {
                AcceptPolicy(applicationPolicies.data?.[0].id || '')
                  .then((res) => {
                    showToast({
                      toast,
                      status: 'success',
                      title: 'Sucesso',
                      description: 'Política aceita com sucesso',
                    });
                    applicationPolicies.refetch();
                  })
                  .catch((err) => {
                    console.error(err);
                    showToast({
                      toast,
                      status: 'error',
                      title: 'Error',
                      description: 'Ocorreu um erro desconhecido',
                    });
                  });
              }}
            >
              Aceitar
            </ButtonComponent>
          </Flex>
        </>
      ) : (
        <>
          <TitleTextComponent subTitle>
            Todos os termos foram vistos e respondidos
          </TitleTextComponent>
          <Flex justifyContent={'space-around'}>
            <ImageComponent width={'600px'} src={allAccepted} />
          </Flex>
        </>
      )}
    </>
  );
}
