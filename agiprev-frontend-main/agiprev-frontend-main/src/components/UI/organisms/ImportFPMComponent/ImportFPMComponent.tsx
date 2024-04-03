import { Flex, useToast } from '@chakra-ui/react';
import { collectionImport } from '../../../../services/CollectionService';
import { expenseImport } from '../../../../services/ExpenseService';
import { useUserData } from '../../../../services/LoginService';
import { revenueImport } from '../../../../services/RevenueService';
import InputComponent from '../../atoms/InputComponent/InputComponent';
import { ContentModalIconComponent } from '../../molecules/ContentModalIconComponent/ContentModalIconComponent';
import ModalStructureComponent from '../../molecules/ModalStructureComponent/ModalStructureComponent';
import React, { useState } from 'react';
import TitleTextComponent from '../../atoms/HeaderTextComponent/TitleTextComponent';
import { FPMLaunchImport } from '../../../../services/FPMLaunchService';
import { showToast } from '../../../../utils/showToast';
import { parse } from 'date-fns'

type ImportFpmModalComponentProps = {
  onClose: () => void;
  isOpen: boolean;
  type: 'collection' | 'revenue' | 'expense' | 'FPM';
};

export function ImportFpmComponent(props: ImportFpmModalComponentProps) {

  const toast = useToast();

  const [msgFinished] = useState([
    { //0
      title: 'Conectando com o robô da XMKTECH',
      subTitle: 'Sua importação está sendo realizada pelo robô da XMKTECH'
    }
  ])
  const [currentStep, setCurrentStep] = React.useState<number>(0)

  const user = useUserData();
  const newDate = new Date();
  const defaultImportDate = `${user?.year}-${newDate
    .getMonth()
    .toString()
    .padStart(2, '0')}`;
  const [importDate, setImportDate] = React.useState(defaultImportDate);
  const [started, setStarted] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  async function onImport() {

    function verificarMesExistente(mesSelecionado: string): boolean {
      const dataSelecionada = parse(mesSelecionado, 'yyyy-MM', new Date());
      const inicioDoMesSelecionado = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), 1);

      const dataAtual = new Date();
      const inicioDoMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

      return inicioDoMesSelecionado > inicioDoMesAtual;
    }

    function verificarEImportar(mesSelecionado: string) {
      return new Promise((resolve, reject) => {
        if (mesSelecionado === '') {
          console.error('Selecione o mês para importar');
          return reject(new Error('Não foi possível concluir o processo. Confira os dados e tente de novo'));
        } else if (verificarMesExistente(mesSelecionado)) {
          console.error('Selecione o mês para importar');
          return reject(new Error('Não foi possível concluir o processo. Confira os dados e tente de novo'));
        } else {
          resolve('Importação bem-sucedida');
        }
      });
    }

    try {
      await verificarEImportar(importDate)

      setStarted(true);
      setCurrentStep(0) // conectando
      
      showToast({
        toast,
        status: 'info',
        title: 'Requisição realizada',
        description: 'Importação em andamento, avisaremos quando for concluída!',
      });

      if (props.type === 'collection') {
        await collectionImport(importDate);
      }
      if (props.type === 'revenue') {
        await revenueImport(importDate);
      }
      if (props.type === 'expense') {
        await expenseImport(importDate);
      }
      if (props.type === 'FPM') {
        await FPMLaunchImport(importDate);
      }
      setFinished(true);

      showToast({
        toast,
        status: 'success',
        title: 'Sucesso',
        description: 'Importação bem-sucedida',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido';
      showToast({
        toast,
        status: 'error',
        title: 'Erro',
        description: errorMessage,
      });

      return;
    }
  }

  function onClose() {
    props.onClose();
    setStarted(false);
    setFinished(false);
    setImportDate(defaultImportDate);
  }

  return (
    <ModalStructureComponent
      title={!started ? 'Selecione a data' : finished ? 'Concluído' : 'Aguarde'}
      isLoadingTitle={!finished && started}
      isOpen={props.isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      {!started ? (
        <ContentModalIconComponent
          body={
            <>
              <Flex margin={'0 0 30px 0'}>
                <TitleTextComponent>
                  {props.type === 'FPM'
                    ? 'Selecione o período'
                    : 'Selecione o mês para importar'}
                </TitleTextComponent>
              </Flex>
              <InputComponent
                type="month"
                value={importDate}
                onChange={(input) => setImportDate(input.target.value)}
              />
            </>
          }
          button={{
            onClick: onImport,
            label: 'Importar',
          }}
        />
      ) : (
        <ContentModalIconComponent
          customIcon={finished ? 'success' : 'connect'}

          title={msgFinished[currentStep].title}
          subTitle={msgFinished[currentStep].subTitle}

          button={{
            disabled: !finished,
            onClick: onClose,
            label: 'Ok',
          }}
        />
      )}
    </ModalStructureComponent>
  );
}
