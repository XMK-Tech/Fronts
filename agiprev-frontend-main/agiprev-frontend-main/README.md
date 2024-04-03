# Sistema base

## 🚀 App usado como base para outros apps

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![Npm package version](https://badgen.net/npm/v/express)](https://npmjs.com/package/express)

#### <a href="https://pt-br.reactjs.org/">🔗 React</a>

# Tabela de conteúdos

<!--ts-->

- [Sobre](#sobre)
  - [Gitflow](#gitflow)
  - [Atomic Design](#atomic-design)
- [Tecnologias](#-tecnologias)
- [Como usar](#como-usar)
  - [Pre Requisitos](#pre-requisitos)
  - [Variáveis secretas de ambiente](#variáveis-secretas-de-ambiente)
  - [Configurar firebase para o git](#configurar-firebase-para-o-git)
  - [Executar em desenvolvimento](#executar-em-desenvolvimento)
  <!--te-->

### Sobre

O projeto consiste em um template em React com componentes e estrutura base
para serem reutilizados em outros projetos.

[TanStack Query](https://tanstack.com/query/) foi utilizado para a comunicação com o backend

[Storybook](https://storybook.js.org/) foi utilizado para isolar componentes (Para mais detalhes sobre os compnentes veja [Atomic Design](#atomic-design))

#### Gitflow

Este projeto utiliza o modelo gitflow em são utilizadas duas branches principais, a main e a develop,
e dois tipos de branches temporárias, feature e hotfix.

Cada branch tem uma função básica:

- A branch main é utilizada para o versionamento e deploy, aqui é onde fica todo o código que está em produção
- A branch develop é utilizada para testes e correções, ela possui funcionalidades que ainda não foram para a main
- As branches de feature são utilizadas para desenvolvimento de novas funcionalidades, são criadas a partir da develop e usadas para desenvolver funcionalidades especificas, geralmente seu nome é formado por _feature/"nome da funcionalidade"_
- As branches de hotfix são utilizadas para correções emergênciais na branch main, já que o bug vai estar nas duas branches, quando o hotfix é criado é necessário fazer merge tanto em main quanto em dev, , geralmente seu nome é formado por _feature/"nome da alteração"_

Links úteis:

- [Gitflow](https://www.alura.com.br/artigos/git-flow-o-que-e-como-quando-utilizar)

#### Atomic Design

Este projeto está componentizado de acordo com o atomic design o qual é dividido em cinco componentes que trabalham juntos para criar interfaces hierárquicas

São eles

- Átomos: São as partes mais básicas da interface, como um botão
- Moléculas: Grupos simples de elementos da interface que funcionam juntos como uma unidade
- Organismos: Conjuntos de moléculas que funcionam juntas como uma unidade, como um header de um site
- Templates: São objetos no nível de página, aqui é onde é definido o layout
- Páginas: O resultado final, o template com informações reais

Obs: pelo fato de ser um sistema base este projeto só possui Organismos, Moléculas e Átomos

Links úteis:

- [Atomic Design](https://medium.com/pretux/atomic-design-o-que-%C3%A9-como-surgiu-e-sua-import%C3%A2ncia-para-a-cria%C3%A7%C3%A3o-do-design-system-e3ac7b5aca2c)

#### Chakra UI

Para a estilização decidimos utilizar a biblioteca de componentes Chakra UI, pois ela possui uma grande variedade de componentes e de fácil customização reduzindo a quantidade de estilos no código.

Vantagens

- Grande variedade de componentes
- Fácil customização
- Reduz a quantidade de estilos no código, assim o tornando mais limpo

Obs: iremos adotar a padronização de componentes utilizando o Chakra,
irá funcionar da seguinte forma:

criaremos nossos componentes utilizando os componentes do Chakra, passando para
os nossos componentes as propriedades necessárias, iremos evitar estilos adicionais, aproveitando ao máximo os estilos que a biblioteca nos oferece.

Links úteis:

- [Chakra UI](https://chakra-ui.com/docs/components)

### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [React](https://pt-br.reactjs.org/)
- [ReactRouter](https://reactrouter.com/en/main)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query/)
- [Storybook](https://storybook.js.org/)

### Como usar

#### Pre Requisitos

- [Node](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Npm](https://docs.npmjs.com/cli/v7/commands/npm-install)

#### Variáveis secretas de ambiente

As variáveis de ambiente utilizadas no sistema estão declaradas em environment.ts.<br />
Algumas das variáveis que são declaradas não estão com o valor colocado no código enviado para o github. (No caso as variáveis secretas colocadas em .env.development.local)<br />
Para fazer o projeto funcionar com as variáveis não estão no github alguns passos precisam ser seguidos.

Como fazer o projeto funcionar em uma nova máquina:

1. Criar o arquivo .env.development.local
2. Criar as variáveis de ambiente presentes com os valores (Requisitar valores reais ao admin) \*Exemplo: REACT_APP_GOOGLE_API_KEY=google<br />
   2.1. REACT_APP_GOOGLE_API_KEY<br />
   2.2. REACT_APP_FACEBOOK_API_KEY<br />
   2.3. REACT_APP_APPLE_API_KEY<br />
   2.4 REACT_APP_MICROSOFT_API_KEY<br />

Obs: adicione mais variáveis nessa lista conforme forem sendo adicionadas ao projeto

Para criar uma nova variável secreta siga estes passos:

1. Para fazer funcionar localmente<br />
   1.1. Adicione a variável ao .env.development.local<br />
   1.2. Adicione a declaração da variável ao arquivo environment.ts que está em src conforme as variáveis já estabelecidas
2. Para fazer funcionar no git<br />
   2.1. Adicione a variável ao actions secrets do git<br />
   &emsp;2.1.1. No repositório do git vá para Settings > Security > Secrets and variables > Actions<br />
   &emsp;2.1.2. Na aba de secrets clique em New repository secret<br />
   &emsp;2.1.3. Coloque no nome da nova variável, seu conteúdo e clique em Add secret<br />
   2.2. Adicione a variável aos workflows na pasta .github/workflows na parte de env:<br />
   &emsp;2.2.1. Adicione ao workflow firebase-hosting-merge.yml<br />
   &emsp;2.2.2. Adicione ao workflow firebase-hosting-pull-request.yml

Obs: Adicione mais itens aos workflows conforme for necessário

Obs²: ao criar outro workflow que necessite das variáveis secretas de ambiente adicionar todas em uma instrução env logo após a instrução on

Obs³: para criar variáveis não secretas adicione elas em .env e depois declare elas em environment.ts

#### Configurar firebase para o git
primeiro instale o firebase cli :

```
npm install -g firebase-tools
```

depois faça login: 
```
firebase login 
```
use o comando e siga os passos do wizard para terminar a configuração

```
firebase init hosting:github 
```


#### Executar em desenvolvimento

primeiro instale as dependências utilzando o comando :

```
yarn
```

com as dependências instaladas execute o comando :

```
yarn start
```

em seguida o Aplicativo deverá abrir no navegador.

### Autor

---

<a href="https://locomotiva.digital/">
 <img style="border-radius:50%;" src="https://avatars.githubusercontent.com/u/85842648?s=200&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Locomotiva</b></sub></a> <a href="https://github.com/LocomotivaSoftware" title="Locomotiva">🚀</a>

Feito com ❤️ por Locomotiva Digital!

[![Linkedin Badge](https://img.shields.io/badge/-Locomotiva-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/company/locomotiva-digital/about/)](https://www.linkedin.com/company/locomotiva-digital/about/)
[![Gmail Badge](https://img.shields.io/badge/-locomotiva.digital-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:tgmarinho@gmail.com)](https://locomotiva.digital/#container2)
