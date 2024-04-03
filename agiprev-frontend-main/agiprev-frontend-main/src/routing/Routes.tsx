import { FC } from 'react';
import {
  FaSignOutAlt,
  FaHome,
  FaDollarSign,
  FaEdit,
  FaRegCreditCard,
  FaHandHoldingUsd,
  FaCashRegister,
  FaUser,
  FaCog,
} from 'react-icons/fa';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import LoginTemplateComponent from '../components/templates/LoginTemplate/LoginTemplateComponent';
import RegisterTemplateComponent from '../components/templates/RegisterTemplate/RegisterTemplateComponent';
import NavbarComponent from '../components/UI/molecules/NavbarComponent/NavbarComponent';
import { useLogoff, useUserData } from '../services/LoginService';
import OnboardingTemplateComponent from '../components/templates/OnboardingTemplate/OnboardingTemplateComponent';
import PhysicalPersonTemplateComponent from '../components/templates/PhysicalPersonTemplate/PhysicalPersonTemplateComponent';
import DashboardsPage from '../pages/DashboardsPage';
import RevenuesTemplateComponent from '../components/templates/RevenuesTemplate/RevenuesTemplateComponent';
import WelcomeComponent from '../components/UI/atoms/WelcomeComponent';
import UsersEditTemplateComponent from '../components/templates/UsersEditTemplate/UsersEditTemplateComponent';
import { CardScreenContainer } from '../components/UI/atoms/CardScreenContainer/CardScreenContainer';
import SchedulingPage from '../pages/SchedulingPage';
import TermsAndPoliciesPage from '../pages/TermsAndPolicies.page';
import ProfileTemplateComponent from '../components/templates/ProfileTemplate/ProfileTemplateComponent';
import ForgotPasswordTemplateComponent from '../components/templates/ForgotPasswordTemplate/ForgotPasswordTemplateComponent';
import PermissionsTemplateComponent from '../components/templates/PermissionsTemplate/PermissionsTemplateComponent';
import ChangePasswordTemplateComponent from '../components/templates/ChangePasswordTemplate/ChangePasswordTemplateComponent';
import JuridicalPersonTemplateComponent from '../components/templates/JuridicalPersonTemplate/JuridicalPersonTemplateComponent';
import MessageTemplatesTemplateComponent from '../components/templates/MessageTemplatesTemplate/MessageTemplatesTemplateComponent';
import { ChatTemplateComponent } from '../components/templates/ChatTemplateComponent/ChatTemplateComponent';
import AttendanceClientTemplateComponent from '../components/templates/AttendanceClientTemplate/AttendanceClientTemplateComponent';
import AttendanceTemplateComponent from '../components/templates/AttendanceTemplate/AttendanceTemplateComponent';
import { NavbarButtonProps } from '../components/UI/atoms/NavbarItemsComponent/NavbarItemsComponent';
import RubricTemplateComponent from '../components/templates/RubricTemplate/RubricTemplateComponent';
import RubricDetailsTemplateComponent from '../components/templates/RubricTemplate/RubricDetailsTemplateComponent';
import CollectionTemplateComponent from '../components/templates/CollectionTemplate/CollectionTemplateComponent';
import IndexTemplateComponent from '../components/templates/IndexTemplate/IndexTemplateComponent';
import RelatedEntityTemplateComponent from '../components/templates/RelatedEntityTemplateComponent/RelatedEntityTemplateComponent';
import PersonTemplateComponent from '../components/templates/PersonTemplateComponent/PersontemplateComponent';
import ExpenseTemplateComponent from '../components/templates/ExpenseTemplate/ExpenseTemplateComponent';
import UsersTemplateComponent from '../components/templates/UsersTemplateComponent/UserTemplateComponent';
import VerificationTemplateComponent from '../components/templates/VerificationTemplateComponent/VerificationTemplateComponent';
import AccessProfileTemplateComponent from '../components/templates/AccessProfileTemplate/AccessProfileTemplateComponent';
import FPMLaunchTemplateComponent from '../components/templates/FPMLauchTemplate/FPMLaunchTemplateComponent';
import RevenueRegisterTemplateComponent from '../components/templates/RevenuesTemplate/RevenueRegisterTemplateComponent';
import IndexRegisterTemplateComponent from '../components/templates/IndexTemplate/IndexRegisterTemplateComponent';
import ExpenseRegisterTemplateComponent from '../components/templates/ExpenseRegisterTemplateComponent/ExpenseRegisterTemplateComponent';
import CollectionRegisterTemplateComponent from '../components/templates/CollectionRegisterTemplateComponent/CollectionRegisterTemplateComponent';
import PersonRegisterTemplateCommponent from '../components/templates/PersonRegisterTemplateComponent/PersonRegisterTemplateComponent';
import UserRegisterTemplateComponent from '../components/templates/UsersTemplateComponent/UserRegisterTemplateComponent';
import RubricRegisterTemplateComponent from '../components/templates/RubricRegisterTemplateComponent/RubricRegisterTemplateComponent';
import RubricAccountRegisterTemplateComponent from '../components/templates/RubricAccountRegisterTemplateComponent/RubricAccountRegisterTemplateComponent';
import RelatedEntityRegisterTemplateComponent from '../components/templates/RelatedEntityRegisterTemplateComponent/RelatedEntityRegisterTemplateComponent';
import EnableAgiprevUserTemplateComponent from '../components/templates/EnableAgiprevUserTemplateComponent/EnableAgiprevUserTemplateComponent';
import AccessProfileRegisterTemplateComponent from '../components/templates/AccessProfileRegisterTemplate/AccessProfileRegisterTemplateComponent';
import CreatePasswordTemplateComponent from '../components/templates/CreatePasswordTemplate/CreatePasswordTemplateComponent';
import UsersPermissionRegisterTemplateComponent from '../components/templates/UsersPermissionRegisterTemplate/UsersPermissionRegisterTemplateComponent';
import { useExistsPermission } from '../services/PermissionService';
import ConfigTemplateComponent from '../components/templates/ConfigTemplateComponent/ConfigTemplateComponent';

function MainPage() {
  const logoff = useLogoff();
  const buttons: NavbarButtonProps[] = [
    {
      icon: <FaHome />,
      label: 'Home',
      link: '/dashboard',
      testId: 'Dashboard',
    },
    {
      icon: <FaUser />,
      label: 'Perfil de acesso',
      link: '/access-profile',
      testId: 'access-profile',
    },
    {
      icon: <FaEdit />,
      label: 'Cadastros',
      subItem: [
        {
          link: '/person',
          label: 'Cadastro de Pessoas',
          testId: 'person',
          disabled: !useExistsPermission('person', 'read'),
        },
        {
          link: '/user',
          label: 'Cadastro de Usuário',
          testId: 'user',
          disabled: !useExistsPermission('users', 'read'),
        },
        {
          link: '/rubric',
          label: 'Cadastro de Rúbricas',
          testId: 'rubric',
          disabled: !useExistsPermission('rubric', 'read'),
        },
        {
          link: '/index',
          label: 'Cadastro de Índices',
          testId: 'index',
          disabled: !useExistsPermission('index', 'read'),
        },
        {
          link: '/entities',
          label: 'Cadastro de Entidades',
          testId: 'entities',
          disabled: !useExistsPermission('relatedentity', 'read'),
        },
      ],
    },
    {
      icon: <FaDollarSign />,
      label: 'Receitas',
      link: '/revenues',
      testId: 'revenues',
      disabled: !useExistsPermission('revenue', 'read'),
    },
    {
      icon: <FaRegCreditCard />,
      label: 'Despesas',
      link: '/expense',
      testId: 'expense',
      disabled: !useExistsPermission('expense', 'read'),
    },
    {
      icon: <FaHandHoldingUsd />,
      label: 'Recolhimento',
      link: '/collection',
      testId: 'collection',
      disabled: !useExistsPermission('collection', 'read'),
    },
    {
      icon: <FaCashRegister />,
      label: 'Apuração',
      link: '/verification',
      testId: 'verification',
      disabled: !useExistsPermission('verification', 'read'),
    },
    {
      icon: <FaCog />,
      label: 'Configurações',
      link: '/config',
      testId: 'config',
    },
    {
      icon: <FaSignOutAlt />,
      link: '',
      label: 'Logoff',
      testId: 'Logoff',
      onSubmit: () => {
        logoff();
      },
    },
  ];
  return (
    <main>
      <div>
        <NavbarComponent buttons={buttons} />
        <CardScreenContainer>
          <Outlet />
        </CardScreenContainer>
      </div>
    </main>
  );
}

export const RoutesComponent: FC = () => {
  const user = useUserData();
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginTemplateComponent />}
        />
        <Route
          path="/icp-brasil"
          element={user ? <Navigate to="/" /> : <LoginTemplateComponent />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <RegisterTemplateComponent />}
        />
        <Route
          path="/forgot-password"
          element={
            user ? <Navigate to="/" /> : <ForgotPasswordTemplateComponent />
          }
        />
        <Route
          path="/first-access"
          element={
            user ? <Navigate to="/" /> : <ForgotPasswordTemplateComponent />
          }
        />
        <Route
          path="/change-password"
          element={
            user ? <Navigate to="/" /> : <ChangePasswordTemplateComponent />
          }
        />
        <Route
          path="/create-password"
          element={
            user ? <Navigate to="/" /> : <CreatePasswordTemplateComponent />
          }
        />
        <Route path="/onboarding" element={<OnboardingTemplateComponent />} />
        <Route
          path="/"
          element={!user ? <Navigate to="/login" /> : <MainPage />}
        >
          <Route index element={<WelcomeComponent />} />
          <Route path="/dashboard" element={<DashboardsPage />} />
          <Route path="/revenues" element={<RevenuesTemplateComponent />} />

          <Route
            path="/revenue-edit/:id"
            element={<RevenueRegisterTemplateComponent />}
          />
          <Route
            path="/revenue-edit"
            element={<RevenueRegisterTemplateComponent />}
          />

          <Route path="/rubric" element={<RubricTemplateComponent />} />
          <Route
            path="/rubric-details/:id"
            element={<RubricDetailsTemplateComponent />}
          />
          <Route
            path="/rubric-edit/:id"
            element={<RubricRegisterTemplateComponent />}
          />
          <Route
            path="/rubric-edit"
            element={<RubricRegisterTemplateComponent />}
          />
          <Route
            path="/rubric-details/:id/account-edit/:account"
            element={<RubricAccountRegisterTemplateComponent />}
          />
          <Route
            path="/rubric-details/:id/account-edit"
            element={<RubricAccountRegisterTemplateComponent />}
          />
          <Route
            path="/entities"
            element={<RelatedEntityTemplateComponent />}
          />
          <Route
            path="/entities-edit/:id"
            element={<RelatedEntityRegisterTemplateComponent />}
          />
          <Route
            path="/entities-edit"
            element={<RelatedEntityRegisterTemplateComponent />}
          />
          <Route path="/collection" element={<CollectionTemplateComponent />} />
          <Route
            path="/collection-register"
            element={<CollectionRegisterTemplateComponent />}
          />
          <Route
            path="/collection-edit/:id"
            element={<CollectionRegisterTemplateComponent />}
          />
          <Route path="/index" element={<IndexTemplateComponent />} />
          <Route
            path="/index-edit/:id"
            element={<IndexRegisterTemplateComponent />}
          />
          <Route
            path="/index-edit"
            element={<IndexRegisterTemplateComponent />}
          />
          <Route path="/fpm" element={<FPMLaunchTemplateComponent />} />
          <Route path="/person" element={<PersonTemplateComponent />} />
          <Route
            path="/person-register"
            element={<PersonRegisterTemplateCommponent />}
          />
          <Route path="/userList" element={<UsersTemplateComponent />} />

          <Route path="/user" element={<UsersTemplateComponent />} />
          <Route
            path="/user-edit"
            element={<UserRegisterTemplateComponent />}
          />
          <Route
            path="/enable-agiprev-user/:id"
            element={<EnableAgiprevUserTemplateComponent />}
          />
          <Route path="/expense" element={<ExpenseTemplateComponent />} />
          <Route
            path="/expense-edit/:id"
            element={<ExpenseRegisterTemplateComponent />}
          />
          <Route
            path="/expense-edit"
            element={<ExpenseRegisterTemplateComponent />}
          />
          <Route path="/user" element={<PhysicalPersonTemplateComponent />} />
          <Route
            path="/verification"
            element={<VerificationTemplateComponent />}
          />
          <Route
            path="/access-profile"
            element={<AccessProfileTemplateComponent />}
          />
          <Route
            path="/access-profile-edit/:id"
            element={<AccessProfileRegisterTemplateComponent />}
          />
          <Route
            path="/access-profile-edit"
            element={<AccessProfileRegisterTemplateComponent />}
          />
          <Route
            path="/juridical"
            element={<JuridicalPersonTemplateComponent />}
          />
          <Route path="/called" element={<AttendanceTemplateComponent />} />
          <Route
            path="/attendance-client"
            element={<AttendanceClientTemplateComponent />}
          />
          <Route
            path="/email-template"
            element={<MessageTemplatesTemplateComponent />}
          />
          <Route path="/scheduling" element={<SchedulingPage />} />
          <Route
            path="/permissions"
            element={<PermissionsTemplateComponent />}
          />
          <Route path="/terms" element={<TermsAndPoliciesPage />} />
          <Route
            path="/user-register/:id/:type"
            element={<UsersEditTemplateComponent />}
          />
          <Route path="/chat/:id" element={<ChatTemplateComponent />} />
          <Route
            path="/user-register"
            element={<UsersEditTemplateComponent />}
          />
          <Route
            path="/user-permission-edit/:id"
            element={<UsersPermissionRegisterTemplateComponent />}
          />
          <Route path="/profile" element={<ProfileTemplateComponent />} />
          <Route path="/my-register" element={<ProfileTemplateComponent />} />
          <Route path="/config" element={<ConfigTemplateComponent />} />
        </Route>
      </Routes>
    </>
  );
};
