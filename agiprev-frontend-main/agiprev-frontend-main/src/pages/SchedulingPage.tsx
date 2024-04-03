import { CloseButton, Flex, Text, Textarea, useToast } from '@chakra-ui/react';
import React from 'react';
import AvatarLabelComponent from '../components/UI/atoms/AvatarLabelComponent/AvatarLabelComponent';
import ContainerStepComponent from '../components/UI/atoms/ContainerStepComponent/ContainerStepComponent';
import DetailsComponent from '../components/UI/atoms/DetailsComponent/DetailsComponet';
import InputComponent from '../components/UI/atoms/InputComponent/InputComponent';
import SearchComponent from '../components/UI/atoms/SearchComponent/SearchComponent';
import OnboardingStructureComponent from '../components/UI/molecules/OnboardingStructureComponent/OnboardingStructureComponent';
import { usePhysicalPerson } from '../services/PhysicalPersonService';
import { showToast } from '../utils/showToast';
function SelectedStep({ step }: { step: number }) {
  const [title, setTitle] = React.useState('');
  const [startHour, setStartHour] = React.useState('');
  const [endHour, setEndHour] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [searchUsers, setSearchUsers] = React.useState('');
  const [listGuets, setListGuets] = React.useState<
    { name: string; email: string; id: string }[]
  >([]);
  const toast = useToast();
  const physcalPerson = usePhysicalPerson(1, 10, searchUsers);

  const list = listGuets?.map((e, i) => (
    <Flex mt={8} justifyContent={'space-between'}>
      <AvatarLabelComponent key={i} label={e.name} subLabel={e.email} />
      <CloseButton
        onClick={() => setListGuets(listGuets.filter((item) => item !== e))}
        size="sm"
        color={'gray.400'}
      />
    </Flex>
  ));
  function addNewGuest(nome: string, email: string, id: string) {
    listGuets.find((e) => e.id === id)
      ? showToast({
          toast: toast,
          title: 'Convidado já adicionado',
          status: 'error',
        })
      : setListGuets([...listGuets, { name: nome, email: email, id: id }]);
  }
  return (
    <Steps selected={step}>
      <ContainerStepComponent title=" Selecione o dia do evento">
        Add CALENDARIO
      </ContainerStepComponent>

      <ContainerStepComponent title=" Preencha as informações do evento">
        <InputComponent
          label="Adicionar Título"
          placeholder="Meu evento"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          variant="flushed"
          marginBottom={4}
        />
        <InputComponent
          label="Hora inicial"
          placeholder="Meu evento"
          value={startHour}
          onChange={(e) => {
            setStartHour(e.target.value);
          }}
          type={'time'}
          variant="flushed"
          marginBottom={4}
        />
        <InputComponent
          label="Hora final"
          placeholder="Meu evento"
          value={endHour}
          variant="flushed"
          onChange={(e) => {
            setEndHour(e.target.value);
          }}
          type={'time'}
          marginBottom={4}
        />
        <Text mb="8px">Adicionar Descrição</Text>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
        />
      </ContainerStepComponent>

      <ContainerStepComponent title="  Adicionar convidados">
        <SearchComponent
          value={searchUsers}
          onChange={(e) => {
            setSearchUsers(e.target.value);
          }}
          placeholder="Adicionar convidados"
          variant="flushed"
        />
        {searchUsers.length > 0 && (
          <Flex
            backgroundColor={'white'}
            zIndex={1}
            w={280}
            maxH={350}
            overflowY="auto"
            flexDirection={'column'}
          >
            {physcalPerson?.data?.data?.map((e: any, i: any) => (
              <Flex
                onClick={() => {
                  addNewGuest(e.displayName, e.personEmail, e.id);
                  setSearchUsers('');
                }}
                borderRadius={8}
                padding={2}
                _hover={{
                  backgroundColor: 'gray.200',
                  cursor: 'pointer',
                }}
              >
                <AvatarLabelComponent
                  key={i}
                  label={e.displayName}
                  subLabel={e.personEmail}
                />
              </Flex>
            ))}
          </Flex>
        )}
        <Flex h={300} overflowY="auto" flexDirection={'column'}>
          {list}
        </Flex>
      </ContainerStepComponent>

      <ContainerStepComponent title=" Detalhes do agendamento">
        <Flex>
          <Flex minW={150} flexDirection={'column'}>
            <DetailsComponent label="Dia" value="10/05/2025" />
            <DetailsComponent
              label="Hora Inicial"
              value={startHour}
              backgroundColor="blue.600"
            />
            <DetailsComponent label="Descrição" value={description} />
          </Flex>
          <Flex flexDirection={'column'}>
            <DetailsComponent label="Título" value={title} />
            <DetailsComponent
              label="Hora Final"
              value={endHour}
              backgroundColor="blue.600"
            />
          </Flex>
        </Flex>
      </ContainerStepComponent>
    </Steps>
  );
}

const Steps = (props: {
  children: React.ReactElement[];
  selected: number;
}): React.ReactElement => {
  return props.children[props.selected];
};

export default function SchedulingPage() {
  const steps = ['Selecionar Dia', 'Informações', 'Convidados', 'Confirmação'];
  const [step, setStep] = React.useState(0);

  return (
    <OnboardingStructureComponent
      titles={['Agendamento', 'Agendamento', 'Agendamento', 'Agendamento']}
      subtitles={[
        'Preencha as informações abaixo para realizar o agendamento',
        'Preencha as informações abaixo para realizar o agendamento',
        'Preencha as informações abaixo para realizar o agendamento',
        'Preencha as informações abaixo para realizar o agendamento',
      ]}
      steps={steps}
      currentStep={step}
      step={step}
      setStep={setStep}
      finishButtonLabel="Agendar"
      onSubmit={() => {}}
    >
      <Flex mt={6} justifyContent={'center'}>
        <SelectedStep step={step} />
      </Flex>
    </OnboardingStructureComponent>
  );
}
