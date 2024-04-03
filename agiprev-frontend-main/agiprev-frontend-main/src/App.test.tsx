import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const testUserUsername = 'Administrator';
const testUserPassword = 'Administrator';

// Vamos implementar futuramente com cypress

describe.skip('E2E tests', () => {
  afterEach(() => {
    try {
      doLogoff();
    } catch (err) {}
  });
  test('renders sign-in with google button', () => {
    render(<App />);
    const buttonElement = screen.getByText(/Entrar com o Google/i);
    expect(buttonElement).toBeInTheDocument();
  });
  test('Sign in successfuly', async () => {
    //arrange
    render(<App />);
    // assert
    await doLogin();
    const welcomeMessage = await getWelcomeMessage();
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('Sign out successfuly', async () => {
    //arrange
    render(<App />);
    await doLogin();
    // act
    doLogoff();
    // assert
    const signInMessage = screen.getByText(
      /Bem Vindo! Acesse com suas credenciais/i
    );
    expect(signInMessage).toBeInTheDocument();
  });
});

async function getWelcomeMessage() {
  return await screen.findByText(/Welcome/i, {}, { timeout: 3000 });
}

function doLogoff() {
  const drawerButton = screen.getByTestId('open-drawer');
  fireEvent.click(drawerButton);
  const logoffButton = screen.getByTestId('Logoff');
  fireEvent.click(logoffButton);
}

async function doLogin() {
  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Senha/i);
  const buttonElement = screen.getAllByText(/Entrar/i)[0];
  // act
  fireEvent.change(emailInput, { target: { value: testUserUsername } });
  fireEvent.change(passwordInput, { target: { value: testUserPassword } });
  fireEvent.click(buttonElement);
  await getWelcomeMessage();
}
