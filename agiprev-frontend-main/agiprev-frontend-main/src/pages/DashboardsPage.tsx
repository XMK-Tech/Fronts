import ImageComponent from '../components/UI/atoms/ImageComponent/ImageComponent';
import { Center } from '@chakra-ui/layout';
import dashboard from '../assets/dashboard.png';

export default function DashboardsPage() {
  return (
    <>
      <Center>
        <ImageComponent
          style={{ borderRadius: 8 }}
          src={dashboard}
          width="50%"
        ></ImageComponent>
      </Center>
    </>
  );
}
