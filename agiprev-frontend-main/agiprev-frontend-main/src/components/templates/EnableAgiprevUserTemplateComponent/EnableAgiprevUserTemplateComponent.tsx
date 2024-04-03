import { useParams } from 'react-router-dom';
import UserFormComponent from '../../UI/organisms/UserFormComponent/UserFormComponent';

export default function EnableAgiprevUserTemplateComponent() {
  const params = useParams<{ id: string }>();
  return <UserFormComponent isEnableAgiprevUser id={params.id} />;
}
