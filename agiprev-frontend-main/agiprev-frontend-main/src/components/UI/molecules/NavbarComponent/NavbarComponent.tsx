import { useEffect, useState } from 'react';
import NavbarItemsComponent, {
  NavbarItemsProps,
} from '../../atoms/NavbarItemsComponent/NavbarItemsComponent';
import {
  UserData,
  useSetUserData,
  useUserData,
} from '../../../../services/LoginService';
import {
  Box,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Image,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  FaAngleDoubleRight,
  FaBars,
  FaRegCommentDots,
  FaRegUser,
} from 'react-icons/fa';
import Agiprev from '../../../../assets/images/agiprev.png';
import NotificationMenuComponent from '../NotificationMenuComponent/NotificationMenuComponent';
import { useNavigate } from 'react-router-dom';
import { getMessageReport } from '../../../../services/MessagesService';
import InputSelectComponent from '../../atoms/InputSelectComponent/InputSelectComponent';
import { UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { AvatarSimpleComponent } from '../../atoms/AvatarSimpleComponent/AvatarSimpleComponent';
import TextComponent from '../../atoms/TextComponent/TextComponent';
import {
  PhysicalPerson,
  useMyProfile,
} from '../../../../services/PhysicalPersonService';
import IconButtonComponent from '../../atoms/ButtonComponent/IconButton';
import {
  useApiEntities,
  useEntitiesSelectUser,
} from '../../../../services/EntitiesService';
import { capitalizeFirstLetter } from '../../../../utils/StringFormatter';
import { ENABLE_MIDDLEWARE } from '../../../../environment';

export default function NavbarComponent(props: NavbarItemsProps) {
  const user = useUserData();
  const entities = useEntitiesSelectUser();
  const setUser = useSetUserData();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const agiprevConfig = useApiEntities();
  const queryClient = useQueryClient();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const person = useMyProfile();
  const [municipioUF, setMunicipioUF] = useState<string>('');

  function EmailValidation(person: UseQueryResult<PhysicalPerson, unknown>) {
    if (person.data?.user) {
      return person.data.user.email;
    } else {
      return '';
    }
  }

  useEffect(() => {
    const municipioNome = agiprevConfig.data?.agiprev.municipioNome;
    const estadoSigla = agiprevConfig.data?.agiprev.estadoSigla;

    if (municipioNome && estadoSigla) {
      setMunicipioUF(
        `${capitalizeFirstLetter(municipioNome.toLowerCase())} - ${estadoSigla}`
      );
    } else {
      setMunicipioUF('Favor adicionar Estado e Município nas configurações');
    }
  }, [agiprevConfig.data]);

  const startYear: number = 2018;
  const endYear: number = new Date().getFullYear();

  useEffect(() => {
    setUser({
      ...user,
      year: endYear.toString(),
    } as UserData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endYear, setUser]);

  const options = [];
  for (let year = startYear; year <= endYear; year++) {
    options.push({
      id: year.toString(),
      name: `Exercício - ${year}`,
    });
  }
  console.log(entities.data);
  function getEntityNameById(list: any, id: string | undefined) {
    const filteredList = list.filter((f: any) => f.id === id);
    return filteredList.map((e: any) => e.name).toString();
  }

  return (
    <>
      <Flex
        p={3}
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        backgroundColor={'white'}
        position={'fixed'}
        top={0}
        zIndex={50}
        boxShadow={'0px 0px 20px rgba(0, 0, 0, 0.08)'}
      >
        <Flex ml={isOpen ? '260px' : 0} transition={'.4s'}>
          {isLargerThan768 ? (
            <Flex
              onClick={onOpen}
              cursor={'pointer'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image w={50} src={Agiprev} mr={2} />
              {!isOpen && (
                <IconButtonComponent
                  width={8}
                  height={10}
                  variant={'ghost'}
                  backgroundColor={'gray.100'}
                  arialLabel=""
                  onSubmit={() => {}}
                  Icon={<FaAngleDoubleRight size={'14px'} />}
                />
              )}
            </Flex>
          ) : (
            <IconButton
              aria-label="Open drawer"
              data-testid={'open-drawer'}
              variant={'gost'}
              icon={<FaBars />}
              onClick={onOpen}
            />
          )}
        </Flex>
        <Flex>
          {/* <Flex marginRight={3} alignItems={'center'} justifyContent={'center'}>
            <TextComponent
              fontWeight={'normal'}
              fontSize={'1rem'}
              color={'black'}
              style={{
                borderWidth: '1px', 
                borderColor: 'inherit', 
                borderStyle: 'solid', 
                borderRadius: '0.375rem',
                padding: '8px 16px', 
              }}
            >
              {municipioUF}
            </TextComponent>
          </Flex> */}
          {ENABLE_MIDDLEWARE && (
            <Flex mr={4} alignItems={'center'} justifyContent={'center'}>
              {entities.data?.length === 1 ? (
                <TextComponent mr={4} fontWeight={'semibold'}>
                  {getEntityNameById(entities.data, user?.entity)}
                </TextComponent>
              ) : (
                <InputSelectComponent
                  label=""
                  defaultValue={user?.entity}
                  options={entities.data || []}
                  onChange={(input) => {
                    setUser({
                      token: user?.token || '',
                      personId: user?.personId || '',
                      permissions: user?.permissions || [],
                      userId: user?.userId || '',
                      onBoarding: user?.onBoarding || false,
                      entity: input.target.value,
                      // entity: entities.data?.find(
                      //   (item) => item.id === input.target.value
                      // ),
                    });
                    queryClient.invalidateQueries();
                    window.location.reload();
                  }}
                />
              )}
            </Flex>
          )}
          <Flex marginRight={3} alignItems={'center'} justifyContent={'center'}>
            <InputSelectComponent
              label=""
              defaultValue={endYear.toString()}
              options={options}
              onChange={(input) => {
                setUser({
                  ...user,
                  year: input.target.value,
                } as UserData);
                queryClient.invalidateQueries();
              }}
            />
          </Flex>
          <NotificationMenuComponent />
          <IconButton
            aria-label="message report"
            variant={'guost'}
            ml={'10px'}
            icon={<FaRegCommentDots />}
            onClick={() => {
              getMessageReport();
            }}
          />
          <IconButton
            aria-label=""
            variant={'guost'}
            ml={'10px'}
            icon={<FaRegUser />}
            onClick={() => {
              navigate('/my-register');
            }}
          />
        </Flex>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerContent maxW={260}>
            <DrawerCloseButton color={'white'} />
            <DrawerHeader
              minH={130}
              backgroundSize={'cover'}
              backgroundPosition={'center'}
              bgImg={require('../../../../assets/images/bg.jpg')}
            >
              <Flex h={'100%'} justifyContent={'end'} flexDirection={'column'}>
                <AvatarSimpleComponent
                  src={person.data?.profilePicUrl}
                  size="md"
                />
                <TextComponent fontSize={14} color={'white'}>
                  {person.data?.name}
                </TextComponent>
                <TextComponent
                  fontWeight={'light'}
                  fontSize={10}
                  color={'white'}
                >
                  {EmailValidation(person)}
                </TextComponent>
              </Flex>
            </DrawerHeader>
            <DrawerBody p={2}>
              <NavbarItemsComponent buttons={props.buttons} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <Box mt={'90px'}></Box>
    </>
  );
}
