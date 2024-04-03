import React from 'react';
import { Box, Flex, Tab, Tabs } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export type NavbarItemsProps = {
  buttons: NavbarButtonProps[];
};

export type NavbarButtonProps = {
  label?: string;
  icon: React.ReactNode;
  link?: string;
  onSubmit?: () => void;
  testId?: string;
  permission?: Permissions;
  open?: boolean;
  disabled?: boolean;
  subItem?: {
    label?: string;
    icon?: React.ReactNode;
    link?: string;
    onSubmit?: () => void;
    testId?: string;
    permission?: Permissions;
    disabled?: boolean;
  }[];
};

export default function NavbarItemsComponent(props: NavbarItemsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [buttons, setButtons] = React.useState(
    props.buttons.map((item) =>
      item.subItem?.some((subitem) => subitem.link === location.pathname)
        ? { ...item, open: true }
        : item
    )
  );
  return (
    <Tabs variant="unstyled">
      {buttons.map((button, index) => {
        return (
          <>
            <Tab
              justifyContent={'space-between'}
              isDisabled={button.disabled}
              onClick={(e) => {
                button.link && navigate(button.link);
                button.onSubmit?.();
                if (button.subItem)
                  setButtons(
                    buttons.map((item, i) =>
                      i === index ? { ...item, open: !item.open } : item
                    )
                  );
              }}
              key={index}
              fontSize={14}
              _selected={{ textColor: 'auto', bg: 'auto' }}
              textColor={location.pathname !== button?.link ? 'auto' : 'white'}
              bgColor={
                location.pathname !== button?.link ? 'auto' : 'brand.500'
              }
              borderRadius={6}
              width={'100%'}
              my={2}
            >
              <Flex justifyContent={'center'} alignItems={'center'}>
                <Box mr={4}>{button.icon}</Box>
                <Box>{button.label}</Box>
              </Flex>
              {button.subItem && (
                <Box display={'flex'}>
                  {button.open ? (
                    <FaChevronDown size={'10px'} />
                  ) : (
                    <FaChevronRight size={'10px'} />
                  )}
                </Box>
              )}
            </Tab>
            {button.open &&
              button.subItem?.map((subitem, subitemI) => {
                return (
                  <Tab
                    data-testid={subitem.testId}
                    isDisabled={subitem.disabled}
                    onClick={(e) => {
                      subitem.link && navigate(subitem.link);
                      subitem.onSubmit?.();
                    }}
                    key={`${index}-${subitemI}`}
                    fontSize={14}
                    _selected={{ textColor: 'auto', bg: 'auto' }}
                    textColor={
                      location.pathname !== subitem?.link ? 'auto' : 'white'
                    }
                    bgColor={
                      location.pathname !== subitem?.link ? 'auto' : 'brand.500'
                    }
                    borderRadius={6}
                    width={'100%'}
                  >
                    <Box>{subitem.icon}</Box>
                    <Box
                      paddingRight={'5px'}
                      width={'100%'}
                      display={'flex'}
                      textAlign={'left'}
                    >
                      <Box>・</Box>
                      {subitem.label}
                    </Box>
                  </Tab>
                );
              })}
          </>
        );
      })}
    </Tabs>
  );
}
