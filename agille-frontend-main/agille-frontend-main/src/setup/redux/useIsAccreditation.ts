import {useLocation} from 'react-router-dom'

export const useIsAccreditation = () => {
  const location = useLocation()
  const isAccreditationPage = location.pathname.includes('credenciamento')
  return isAccreditationPage
}
