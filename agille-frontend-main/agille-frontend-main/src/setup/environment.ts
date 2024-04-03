const environment = {
  middlewareApi: process.env.REACT_APP_MIDDLEWARE_API_URL as string,
  agilleApi: process.env.REACT_APP_AGILLE_API_URL as string,
  enableDeclaration: process.env.REACT_APP_ENABLE_DECLARATION === 'true',
  enableReports: process.env.REACT_APP_ENABLE_REPORTS === 'true',
}
export default environment
