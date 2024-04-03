import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoutesComponent } from './routing/Routes';
import { UserProvider } from './services/LoginService';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import theme from './theme';
import { AxiosInterceptor } from './services/Api';
const queryClient = new QueryClient();
function App() {
  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AxiosInterceptor />
            <RoutesComponent />
          </BrowserRouter>
        </QueryClientProvider>
      </ChakraProvider>
    </UserProvider>
  );
}

export default App;
