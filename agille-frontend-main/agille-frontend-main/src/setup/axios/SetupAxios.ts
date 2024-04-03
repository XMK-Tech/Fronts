export default function setupAxios(axios: any, store: any) {
  axios.defaults.headers.Accept = 'application/json'
  const state = store.getState()
  const tenantId = state?.auth?.selectedEntity
  const accessToken = state?.auth?.accessToken
  tenantId && (axios.defaults.headers.common['tenantId'] = tenantId)
  accessToken && (axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`)
  axios.interceptors.request.use((config: any) => {
    const {
      auth: {accessToken, selectedEntity},
    } = store.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    if (selectedEntity) {
      const tenantId = selectedEntity
      config.headers.tenantId = tenantId
    }

    return config
  })
}
