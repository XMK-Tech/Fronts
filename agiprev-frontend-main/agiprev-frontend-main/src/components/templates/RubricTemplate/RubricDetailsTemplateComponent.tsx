import { Badge, Flex, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  RubricAccountsResp,
  deleteRubricAccount,
  useRubricAcountsId,
  useRubricDetails,
} from '../../../services/RubricService';
import TitleTextComponent from '../../UI/atoms/HeaderTextComponent/TitleTextComponent';
import IconButtonComponent from '../../UI/atoms/ButtonComponent/IconButton';
import { FaArrowLeft, FaPencilAlt, FaTrash } from 'react-icons/fa';
import InputComponent from '../../UI/atoms/InputComponent/InputComponent';
import { formatDate } from '../../../utils/functions/formatDate';
import TableComponent from '../../UI/molecules/TableComponent/TableComponent';
import ButtonComponent from '../../UI/atoms/ButtonComponent/ButtonComponent';
import { useIsWeb } from '../../../hooks/useIsWeb';
import {
  PaginationComponent,
  usePagination,
} from '../../UI/molecules/PaginationComponent/PaginationComponent';
import { DeleteModalComponent } from '../../UI/molecules/DeleteModalComponent/DeleteModalComponent';
import React from 'react';
import { showToast } from '../../../utils/showToast';
import { useExistsPermission } from '../../../services/PermissionService';

export default function RubricDetailsTemplateComponent() {
  const navigate = useNavigate();
  const isWeb = useIsWeb();
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const rubric = useRubricDetails(params.id);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [accountId, setAccountId] = React.useState('');
  const rubricDetails = rubric.data;
  const notEditPermission = !useExistsPermission('rubric', 'edit');
  const { pageSize, selectedPage, setSelectedPage } = usePagination(10);
  function onSelectedPageChanged(page: number) {
    setSelectedPage(page);
  }
  const rubricAccounts = useRubricAcountsId(
    params.id || '',
    selectedPage,
    pageSize,
    'name'
  );
  const itemsHeaderTable = [
    { item: 'conta' },
    { item: 'título' },
    { item: 'função', hideOnMobile: true },
    { item: 'natureza de saldo', hideOnMobile: true },
    { item: 'status', hideOnMobile: true },
    { item: 'detalhamento', hideOnMobile: true },
    { item: 'classificação', hideOnMobile: true },
    { item: 'ações' },
  ];
  const itemsBodyTable = (e: RubricAccountsResp) => {
    const mobileColumns = [e.account, e.title];

    const buttons = (
      <Flex>
        <IconButtonComponent
          marginX={1}
          arialLabel="Editar"
          toolTipText="Editar"
          disabled={notEditPermission}
          Icon={<FaPencilAlt />}
          onSubmit={() => {
            navigate(`/rubric-details/${params.id}/account-edit/${e.id}`);
          }}
          backgroundColor={'blue.500'}
        />
        <IconButtonComponent
          toolTipText="Excluir"
          arialLabel="Excluir"
          disabled={notEditPermission}
          Icon={<FaTrash />}
          onSubmit={() => {
            setAccountId(e.id);
            setShowDelete(true);
          }}
        />
      </Flex>
    );

    if (!isWeb) {
      return [...mobileColumns, buttons];
    }
    return [
      ...mobileColumns,
      e.function,
      e.originOfBalanceDescription,
      <Badge variant="solid" colorScheme={e.status === 0 ? 'green' : 'red'}>
        {e.statusDescription}
      </Badge>,
      e.detail,
      e.classifications,
      buttons,
    ];
  };

  return (
    <>
      <Flex justifyContent={'space-between'}>
        <Flex flexDirection={'column'}>
          <TitleTextComponent>Detalhes da Rúbrica - Modelo</TitleTextComponent>
          <TitleTextComponent subTitle>
            você pode visualizar os detalhes
          </TitleTextComponent>
        </Flex>
        <Flex>
          <IconButtonComponent
            toolTipText="Voltar"
            arialLabel="Voltar"
            Icon={<FaArrowLeft />}
            onSubmit={() => navigate('/rubric')}
          />
        </Flex>
      </Flex>
      <Flex mt={4} flexWrap={'wrap'} flexDirection={'column'}>
        <TitleTextComponent subTitle>Modelo</TitleTextComponent>
        <Flex flexDirection={isWeb ? 'row' : 'column'} mt={2}>
          <InputComponent
            label="Nome"
            placeholder={rubricDetails?.name}
            value={rubricDetails?.name}
            disabled
          />
          <InputComponent
            marginRight={isWeb ? 8 : 0}
            marginLeft={isWeb ? 8 : 0}
            label="Data de vigência"
            placeholder={formatDate(rubricDetails?.createdAt)}
            value={formatDate(rubricDetails?.createdAt)}
            disabled
          />
          <InputComponent
            label="Estado"
            placeholder={rubricDetails?.stateName}
            value={rubricDetails?.stateName}
            disabled
          />
        </Flex>
      </Flex>
      <Flex mt={16} flexDirection={'column'}>
        <Flex justifyContent={'space-between'}>
          <TitleTextComponent subTitle>{`Plano de contas / ${
            rubric.data?.totalAccounts
          } - ${
            rubric.data?.totalAccounts === 1 ? 'conta' : 'contas'
          }`}</TitleTextComponent>
          <Flex>
            <ButtonComponent
              disabled={notEditPermission}
              onSubmit={() => {
                navigate(`/rubric-details/${params.id}/account-edit`);
              }}
            >
              Nova Conta
            </ButtonComponent>
          </Flex>
        </Flex>
        <Flex mt={2}>
          <TableComponent
            ItemsHeader={itemsHeaderTable}
            emptyState={false}
            contentFontSize={'10px'}
            isLoading={rubric.isLoading}
            data={
              rubricAccounts.data?.data.map((e) => ({
                items: itemsBodyTable(e),
              })) || []
            }
          />
        </Flex>

        <PaginationComponent
          onSelectedPageChanged={onSelectedPageChanged}
          selectedPage={selectedPage}
          arrayLength={rubricAccounts.data?.metadata.dataSize || 0}
          maxPageItens={pageSize}
        ></PaginationComponent>
      </Flex>
      <DeleteModalComponent
        title="Excluir Conta"
        subTitle="Tem certeza que deseja excluir essa conta ?"
        showModal={showDelete}
        setShowModal={() => {
          setShowDelete(false);
        }}
        onSubmit={() => {
          deleteRubricAccount(accountId).then((res) => {
            showToast({
              toast,
              status: 'success',
              title: 'Sucesso',
              description: 'conta deletada com sucesso',
            });
            setAccountId('');
            rubricAccounts.refetch();
            setShowDelete(false);
          });
        }}
      />
    </>
  );
}
