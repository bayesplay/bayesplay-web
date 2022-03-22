import { waitFor, render, screen } from '@testing-library/react';
import { userEvent} from "@testing-library/user-event"
import Calculator from "./Pages/Calculator.jsx"
import App from "./App.jsx"


test('Render app', async() => {
  render(<App />);

  await waitFor(() => {
    const likelihood = screen.getByTestId("l") 
    userEvent.click(ikelihood)
    userEvent.click(screen.getByText("normal"))
    console.log(screen) 
  })


}, 40000);
