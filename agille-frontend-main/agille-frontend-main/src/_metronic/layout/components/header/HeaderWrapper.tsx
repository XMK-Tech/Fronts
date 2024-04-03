/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {createContext, useContext, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, NavLink, useLocation} from 'react-router-dom'
import AsideMenu from '../../../../app/components/AsideMenu/AsideMenu'
import {Module} from '../../../../app/modules/auth/redux/AuthTypes'

import {getEntitie} from '../../../../app/services/EntitiesApi'
import {RootState} from '../../../../setup'
import environment from '../../../../setup/environment'
import {useEntities} from '../../../../setup/redux/hooks'
import {useLayout} from '../../core'
import {Header} from './Header'
import {DefaultTitle} from './page-title/DefaultTitle'
import {Topbar} from './Topbar'

const HeaderWrapperIcon: React.FC<{className: string}> = (props) => {
  const obj = {icon: props.className}
  return (
    <div className='text-white bg-primary d-flex justify-content-center align-items-center rounded-circle h-30px w-30px m-0'>
      <i className={`text-white fs-1 ${props.className}`}></i>
    </div>
  )
}

type NavigationLinkProps = {
  show: boolean
  items: {
    link: string
    text: string
  }[]
}
const getSelectedIcon = (module: Module | undefined) => {
  if (module === 'Admin') {
    return 'fa-users-cog'
  }
  if (module === 'Backoffice') {
    return 'fa-laptop-code'
  }
  if (module === 'Auditor') {
    return 'fa-search-dollar'
  }
  if (module === 'ContribuinteDTE') {
    return 'far-fa-address-card'
  }
  return '/media/illustrations/custom/adminModule.png'
}
function NavigationLink(props: NavigationLinkProps) {
  const location = useLocation()
  const active = !!props.items.find((i) => i.link === location.pathname)
  const moduleSelected = useSelector<RootState>(({auth}) => auth.selectedModule, shallowEqual) as
    | Module
    | undefined

  return (
    <div className={'tab-pane fade ' + (props.show ? 'active show' : '')}>
      <div className='d-flex flex-stack'>
        <div className='d-flex gap-2'>
          {props.items.map((i) => (
            <NavLink
              key={i.link}
              to={i.link}
              activeClassName='active'
              className={'btn btn-sm btn-active-light-primary fw-bolder'}
            >
              {i.text}
            </NavLink>
          ))}
        </div>
        {moduleSelected === 'Backoffice' ? <EntityLink /> : ''}
      </div>
    </div>
  )
}

const EntityLink: React.FC<{}> = (props) => {
  const [selectedEntityName, setSelectedEntityName] = useState('')
  const selectedEntity = useSelector<RootState>(({auth}) => auth.selectedEntity, shallowEqual) as
    | string

  useEffect(() => {
    getEntitie(selectedEntity).then((entity) => setSelectedEntityName(entity.data.name))
  }, [selectedEntity])
  return (
    <NavLink className='btn btn-sm fw-bolder' activeClassName='' to={'/backoffice/municipios'}>
      <span className='fw-bolder d-flex align-items-center svg-icon svg-icon-2hx svg-icon-primary me-4 mb-2 mb-sm-0'>
        {selectedEntityName}{' '}
        <i className='fw-bolder bi bi-arrow-left-right fs-5 ms-2 text-dark'></i>
      </span>
    </NavLink>
  )
}

function getHeaderItems(module: Module | undefined): string[] {
  if (module === 'Admin') {
    return ['Início', 'Cadastro', 'Consulta']
  }
  if (module === 'Backoffice') {
    return ['Municípios', 'Importação', 'Administrativo']
  }
  if (module === 'Auditor') {
    return ['Início', 'Cadastros', 'Importação', 'Cruzamentos', 'Administrativo']
  }
  if (module === 'ContribuinteDTE') {
    return ['Início', 'Imóveis', 'Contribuintes', 'Procedimentos Fiscais']
  }

  return ['Início', 'Cadastros', 'Importação', 'Cruzamentos', 'Administrativo']
}

const MenuContext = createContext<{
  expand: boolean
  setExpand: (expand: boolean) => void
  width: string
}>({
  expand: false,
  setExpand: () => {},
  width: '',
})

export function MenuContextProvider(props: {children: React.ReactNode}) {
  const [expand, setExpand] = useState(false)
  const width = expand ? '150px' : '70px'
  return (
    <MenuContext.Provider value={{expand, setExpand, width}}>{props.children}</MenuContext.Provider>
  )
}

export const useMenuContext = () => useContext(MenuContext)

export function HeaderWrapper() {
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config
  const location = useLocation()
  const moduleSelected = useSelector<RootState>(({auth}) => auth.selectedModule, shallowEqual) as
    | Module
    | undefined

  const {expand, setExpand, width} = useMenuContext()

  const items = getHeaderItems(moduleSelected)
  const [selectedItem, setSelectedItem] = useState<string>(() => getSelectedMenu(location.pathname))
  const [selectModule, setSelectModule] = useState<Module | undefined>(moduleSelected)

  useEffect(() => {
    const menuSelected = getSelectedMenu(location.pathname)
    setSelectModule(moduleSelected)
    if (items.includes(menuSelected)) setSelectedItem(menuSelected)
  }, [location.pathname, moduleSelected])

  return (
    <>
      <AsideMenu
        expand={expand}
        onExpandChanged={(expand) => setExpand(expand)}
        items={menuMap[selectModule ?? 'Auditor'].map((e) => ({
          ...e,
          subItems: e.items,
        }))}
      ></AsideMenu>
    </>
    //   <div
    //   id='kt_header'
    //   className={clsx(
    //     'header',
    //     classes.header.join(' '),
    //     'align-items-stretch bg-primary flex-column'
    //   )}
    //   {...attributes.headerMenu}
    // >
    //   <div className={clsx(classes.headerContainer.join(' '), 'd-flex ')}>
    //     <div className='header-logo me-5 me-md-10 flex-grow-1 flex-lg-grow-0'>
    //       <Link to='/'>
    //         <HeaderWrapperIcon className={`logo-default fas ${getSelectedIcon(selectModule)}`} />
    //       </Link>
    //     </div>

    //     {/* begin::Wrapper */}
    //     <div className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
    //       {/* begin::Navbar */}
    //       {header.left === 'menu' && (
    //         <div className='d-flex align-items-stretch' id='kt_header_nav'>
    //           <Header
    //             inner={{
    //               items: items,
    //               onItemSelected: (item) => setSelectedItem(item),
    //               selectedItem: selectedItem,
    //             }}
    //           />
    //         </div>
    //       )}

    //       {header.left === 'page-title' && (
    //         <div className='d-flex align-items-center' id='kt_header_nav'>
    //           <DefaultTitle />
    //         </div>
    //       )}

    //       <div className='d-flex align-items-stretch flex-shrink-0'>
    //         <Topbar />
    //       </div>
    //     </div>
    //     {/* end::Wrapper */}
    //   </div>
    //   <div
    //     className='header-navs d-flex align-items-stretch flex-stack h-lg-70px w-100 py-5 py-lg-0'
    //     id='kt_header_navs'
    //   >
    //     <div className='d-lg-flex container-xxl w-100'>
    //       <div
    //         className='d-lg-flex flex-column justify-content-lg-center w-100'
    //         id='kt_header_navs_wrapper'
    //       >
    //         <div className='tab-content'>
    //           <NavigationLinks selectedItem={selectedItem} selectedModule={moduleSelected} />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export const menuMap = {
  [Module.Admin]: [
    {items: [{link: '/admin/dashboard', text: 'Dashboard'}], label: 'Início'},
    {
      items: [
        {link: '/admin/cadastro/subs', text: 'Cadastro de Subsidiárias'},
        {link: '/admin/cadastro/admin', text: 'Cadastro de Administradores'},
      ],
      label: 'Cadastro',
    },
    {
      items: [
        {link: '/admin/consulta/subs', text: 'Consulta de Subsidiárias'},
        {link: '/admin/consulta/admin', text: 'Consulta de Administradores'},
      ],
      label: 'Consulta',
    },
  ],
  [Module.Backoffice]: [
    {
      items: [
        {text: 'Seleção de Municípios', link: '/backoffice/municipios'},
        {text: 'Repasses da união', link: '/backoffice/TransferUnion'},
      ],
      label: 'Municípios',
    },
    {items: [{text: 'Lista de Importações', link: '/backoffice/importacao'}], label: 'Importação'},
    {items: [{text: 'Robô', link: '/backoffice/robo'}], label: 'Robô'},
    {
      items: [
        {text: 'Consulta de Municípios', link: '/backoffice/gerenciamento/consulta-municipios'},
        {text: 'Consulta de Usuários', link: '/backoffice/gerenciamento/consulta-usuarios'},
        {text: 'Novo Município', link: '/backoffice/gerenciamento/cadastro-municipio'},
        {text: 'Novo Usuário', link: '/backoffice/gerenciamento/cadastro-usuario'},
        {text: 'Validação de arquivos', link: '/backoffice/gerenciamento/validacao-arquivos'},
      ],
      label: 'Administrativo',
    },
  ],
  [Module.Auditor]: [
    {items: [{text: 'Dashboard', link: '/auditor/inicio/dashboard'}], label: 'Início'},
    {
      items: [
        {text: 'Nova Importação', link: '/auditor/importacao/nova-importacao'},
        {text: 'Status das Importações', link: '/auditor/importacao/status-importacao'},
      ],
      label: 'Importação',
    },
    {
      items: [
        {text: 'Novo Cruzamento', link: '/auditor/cruzamentos/novo-cruzamento'},
        {text: 'Divergências de Contribuintes', link: '/auditor/cruzamentos/lista-cruzamentos'},
        {text: 'Divergências de Operadoras', link: '/auditor/cruzamentos/operadoras'},
        {text: 'Notificações', link: '/auditor/cruzamentos/notificacoes'},
        {text: 'Autuações', link: '/auditor/cruzamentos/autuacoes'},
      ],
      label: 'Cruzamentos',
    },
    {
      items: [
        {text: 'Consulta de Auditores', link: '/auditor/administrativo/consulta-auditores'},
        {text: 'Novo Auditor', link: '/auditor/administrativo/cadastro-auditor'},
      ],
      label: 'Administrativo',
    },
    {
      items: [
        {text: 'Consulta de Modelos', link: '/auditor/cadastros/consulta-modelos'},
        {text: 'Novo Modelo', link: '/auditor/cadastros/cadastro-modelo'},
        {text: 'Consulta de Contribuintes', link: '/auditor/cadastros/consulta-contribuintes'},
        {text: 'Consulta de Operadoras', link: '/auditor/cadastros/consulta-operadoras'},
        {text: 'Novo Contribuinte', link: '/auditor/cadastros/cadastro-contribuintes'},
      ],
      label: 'Cadastros',
    },
  ],
  [Module.ContribuinteDTE]: [
    {items: [{text: 'Dashboard', link: '/ITR/Dashboard'}], label: 'Início'},
    {
      items: [
        {text: 'Cadastro de Imóveis', link: '/ITR/ITRMainPage/RegisterProperty'},
        {text: 'Consulta de Imóveis', link: '/ITR/ITRMainPage/ConsultProperty'},
        {text: 'Dados do Car', link: '/ITR/ITRCarData'},
      ],
      label: 'Imóveis',
    },
    {
      items: [
        {text: 'Cadastro de Contribuinte', link: '/ITR/RegisterPersons'},
        {text: 'Consulta de Contribuintes', link: '/ITR/ConsultPersons'},
      ],
      label: 'Contribuintes',
    },
    {
      items: [
        {text: 'Cadastro de Procedimento Fiscal', link: '/ITR/RegisterFiscalProcedure'},
        {text: 'Consulta de Procedimentos Fiscais', link: '/ITR/ConsultFiscalProcedure'},
      ],
      label: 'Procedimentos Fiscais',
    },

    {
      items: [
        {text: 'Relatórios', link: '/ITR/Reports'},
        {text: 'Consulta de Auditores', link: '/ITR/ConsultAuditor'},
        {text: 'Novo Auditor', link: '/ITR/RegisterAuditor'},
        {text: 'Documentos do convênio', link: '/ITR/ITRCheckList'},
        {text: 'Cadastro de terra nua', link: '/ITR/RegisterBareLand'},
        ...(environment.enableDeclaration
          ? [{text: 'Consulta de Declarações', link: '/ITR/ConsultDeclarationsPage'}]
          : []),
      ],
      label: 'Administrativo',
    },
    {
      items: [
        {
          text: 'Lançar VTN',
          link: '',
          a: 'https://cav.receita.fazenda.gov.br/autenticacao/login',
        },
      ],
      label: 'Lançar VTN',
    },
    {
      items: [{text: 'Notificações', link: '/ITR/NotificationsPage'}],
      label: 'Notificações',
    },
  
  ],
  [Module.ContribuinteITR]: [
    {
      label: 'Início',
      items: [
        {text: 'Declaração do ITR', link: '/ITR/ITRDeclaration'},
        {text: 'Consulta de Respostas', link: '/ITR/ReplyConsultPage'},
      ],
    },
  ],
  [Module.AuditorDTE]: [
    {items: [{text: 'Dashboard', link: '/DTE/dashboard'}], label: 'Início'},
    {
      items: [
        {text: 'Credenciamento Manual', link: '/DTE/accreditation/cadastro'},
        {text: 'Consulta de Contribuintes', link: '/DTE/accreditation/consulta'},
      ],
      label: 'Contribuintes',
    },
    {
      items: [
        {text: 'Cadastro de Modelos', link: '/DTE/modelos-dte/cadastro'},
        {text: 'Consulta de Modelos', link: '/DTE/modelos-dte/consulta'},
      ],
      label: 'Modelos',
    },
    {
      items: [
        {text: 'Constatações', link: '/DTE/cruzamentos/finding'},
        {text: 'Lançamentos', link: '/DTE/cruzamentos/launch'},
        {text: 'Intimação', link: '/DTE/cruzamentos/summons'},
      ],
      label: 'Notificações',
    },
  ],
}

export function getSelectedMenu(location: string): string {
  const linksList = Object.values(menuMap).flatMap((i) => i)
  const label = linksList.find((i) =>
    i.items.find((j) => j.link && location.includes(j.link))
  )?.label
  return label ?? 'Cadastro'
}

export function getNavigationLinkProps(selectedModule: Module | undefined) {
  return selectedModule ? menuMap[selectedModule] : undefined
}

function NavigationLinks({
  selectedItem,
  selectedModule,
}: {
  selectedItem: string
  selectedModule: Module | undefined
}) {
  const links = getNavigationLinkProps(selectedModule)

  return links ? (
    <>
      {links.map((l, i) => (
        <NavigationLink key={i} {...l} show={l.label === selectedItem} />
      ))}
    </>
  ) : null
}
