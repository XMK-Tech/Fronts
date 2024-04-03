import {Module} from '../app/modules/auth/redux/AuthTypes'
import {
  getNavigationLinkProps,
  getSelectedMenu,
} from '../_metronic/layout/components/header/HeaderWrapper'

const baseUrl = 'https://agille-frontend.web.app/'

describe('Menu header links', () => {
  describe('Auditor links', () => {
    it.each([
      ['inicio/dashboard', 'Início', 'Dashboard'],
      ['importacao/nova-importacao', 'Importação', 'Nova Importação'],
      ['importacao/status-importacao', 'Importação', 'Status das Importações'],
      ['cruzamentos/novo-cruzamento', 'Cruzamentos', 'Novo Cruzamento'],
      ['cruzamentos/lista-cruzamentos', 'Cruzamentos', 'Divergências de Contribuintes'],
      ['cruzamentos/operadoras', 'Cruzamentos', 'Divergências de Operadoras'],
      ['cruzamentos/notificacoes', 'Cruzamentos', 'Notificações'],
      ['cruzamentos/autuacoes', 'Cruzamentos', 'Autuações'],
    ])('link %s should return %s', (link: string, label: string, item: string) => {
      const selectedMenu = getSelectedMenu(`${baseUrl}auditor/${link}`)
      const foundLabel = getLinkLabel(label, `auditor/${link}`, Module.Auditor)
      expect(`${selectedMenu} - ${foundLabel}`).toBe(`${label} - ${item}`)
    })
  })
  describe('ITR links', () => {
    it.each([
      ['Dashboard', 'Início', 'Dashboard'],
      ['ITRMainPage/ConsultProperty', 'Imóveis', 'Consulta de Imóveis'],
      ['ITRMainPage/RegisterProperty', 'Imóveis', 'Cadastro de Imóveis'],
      ['ConsultPersons', 'Contribuintes', 'Consulta de Contribuintes'],
      ['RegisterPersons', 'Contribuintes', 'Cadastro de Contribuinte'],
      ['RegisterFiscalProcedure', 'Procedimentos Fiscais', 'Cadastro de Procedimento Fiscal'],
      ['ConsultFiscalProcedure', 'Procedimentos Fiscais', 'Consulta de Procedimentos Fiscais'],
    ])('link %s should return %s', (link: string, label: string, item: string) => {
      const selectedMenu = getSelectedMenu(`${baseUrl}ITR/${link}`)
      const foundLabel = getLinkLabel(label, `ITR/${link}`, Module.ContribuinteDTE)

      expect(`${selectedMenu} - ${foundLabel}`).toBe(`${label} - ${item}`)
    })
  })
  describe('Admin links', () => {
    it.each([
      ['admin/dashboard', 'Início', 'Dashboard'],
      ['admin/cadastro/subs', 'Cadastro', 'Cadastro de Subsidiárias'],
      ['admin/cadastro/admin', 'Cadastro', 'Cadastro de Administradores'],
      ['admin/consulta/subs', 'Consulta', 'Consulta de Subsidiárias'],
      ['admin/consulta/admin', 'Consulta', 'Consulta de Administradores'],
    ])('link %s should return %s - %s', (link: string, label: string, item: string) => {
      const selectedMenu = getSelectedMenu(`${baseUrl}admin/${link}`)
      const foundLabel = getLinkLabel(label, link, Module.Admin)

      expect(`${selectedMenu} - ${foundLabel}`).toBe(`${label} - ${item}`)
    })
  })
  describe('Backoffice links', () => {
    it.each([
      ['municipios', 'Municípios', 'Seleção de Municípios'],
      ['importacao', 'Importação', 'Lista de Importações'],
      ['robo', 'Robô', 'Robô'],
      ['gerenciamento/consulta-municipios', 'Administrativo', 'Consulta de Municípios'],
      ['gerenciamento/consulta-usuarios', 'Administrativo', 'Consulta de Usuários'],
      ['gerenciamento/cadastro-municipio', 'Administrativo', 'Novo Município'],
      ['gerenciamento/cadastro-usuario', 'Administrativo', 'Novo Usuário'],
    ])('link %s should return %s - %s', (link: string, label: string, item: string) => {
      const selectedMenu = getSelectedMenu(`${baseUrl}backoffice/${link}`)
      const foundLabel = getLinkLabel(label, `backoffice/${link}`, Module.Backoffice)

      expect(`${selectedMenu} - ${foundLabel}`).toBe(`${label} - ${item}`)
    })
  })
  describe('DTE links', () => {
    it.each([
      ['dashboard', 'Início', 'Dashboard'],
      ['accreditation/cadastro', 'Contribuintes', 'Credenciamento Manual'],
      ['accreditation/consulta', 'Contribuintes', 'Consulta de Contribuintes'],
      ['modelos-dte/cadastro', 'Modelos', 'Cadastro de Modelos'],
      ['modelos-dte/consulta', 'Modelos', 'Consulta de Modelos'],
    ])('link %s should return %s - %s', (link: string, label: string, item: string) => {
      const selectedMenu = getSelectedMenu(`${baseUrl}DTE/${link}`)
      const foundLabel = getLinkLabel(label, `DTE/${link}`, Module.AuditorDTE)
      expect(`${selectedMenu} - ${foundLabel}`).toBe(`${label} - ${item}`)
    })
  })
})

function getLinkLabel(label: string, link: string, module: Module) {
  const moduleMenus = getNavigationLinkProps(module)
  const items = moduleMenus?.find((menu) => menu.label === label)?.items
  const foundLabel = items?.find((menu) => menu.link === `/${link}`)?.text
  return foundLabel
}
