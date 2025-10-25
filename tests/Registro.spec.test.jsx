// src/tests/Registro.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Registro from '../src/components/Registro/Registro';
import { BrowserRouter } from 'react-router-dom';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Registro Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza el formulario de registro', () => {
    renderWithRouter(<Registro />);
    
    expect(screen.getByText('Registro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electronico')).toBeInTheDocument();
  });

  it('muestra errores de validacion para campos vacios', async () => {
    renderWithRouter(<Registro />);

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    
    // Click en submit sin llenar campos
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre de usuario es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
      expect(screen.getByText('El correo electronico es obligatorio')).toBeInTheDocument();
    });
  });

  it('valida que el nombre de usuario tenga longitud minima', async () => {
    renderWithRouter(<Registro />);

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    
    // Escribir valor corto
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    
    // Hacer blur para forzar validación
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(screen.getByText(/El largo minimo del nombre de usuario debe ser de almenos 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it('valida formato de email', async () => {
    renderWithRouter(<Registro />);

    const emailInput = screen.getByPlaceholderText('Correo electronico');
    
    // Escribir email inválido
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    
    // Hacer blur para forzar validación
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Correo invalido')).toBeInTheDocument();
    });
  });

  it('valida longitud minima de contraseña', async () => {
    renderWithRouter(<Registro />);

    const passwordInput = screen.getByPlaceholderText('Contraseña');
    
    // Escribir contraseña corta
    fireEvent.change(passwordInput, { target: { value: '12' } });
    
    // Hacer blur para forzar validación
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Contraseña demasiado corta')).toBeInTheDocument();
    });
  });

  it('muestra error cuando el nombre de usuario excede el maximo', async () => {
    renderWithRouter(<Registro />);

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    
    // Escribir nombre muy largo (más de 21 caracteres)
    fireEvent.change(usernameInput, { target: { value: 'a'.repeat(22) } });
    fireEvent.blur(usernameInput);

    await waitFor(() => {
      expect(screen.getByText('El nombre de usuario excede el maximo de 20 caracteres')).toBeInTheDocument();
    });
  });

  it('envia el formulario con datos validos', async () => {
    renderWithRouter(<Registro />);

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const emailInput = screen.getByPlaceholderText('Correo electronico');

    // Llenar con datos válidos
    fireEvent.change(usernameInput, { target: { value: 'testuser123' } });
    fireEvent.change(passwordInput, { target: { value: 'password123456' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith({
        username: 'testuser123',
        password: 'password123456',
        email: 'test@example.com'
      });
    });

    // Verificar que no hay mensajes de error
    expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalido/i)).not.toBeInTheDocument();
  });

  it('limpia los errores cuando el usuario corrige los campos', async () => {
    renderWithRouter(<Registro />);

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    
    // Submit vacío para generar errores
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre de usuario es obligatorio')).toBeInTheDocument();
    });

    // Corregir el campo
    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    fireEvent.change(usernameInput, { target: { value: 'validuser123' } });

    // El error debe desaparecer
    await waitFor(() => {
      expect(screen.queryByText('El nombre de usuario es obligatorio')).not.toBeInTheDocument();
    });
  });

  it('limpia el formulario despues de un envio exitoso', async () => {
    renderWithRouter(<Registro />);

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const emailInput = screen.getByPlaceholderText('Correo electronico');

    // Llenar formulario
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);

    // Verificar que los campos se limpiaron (reset())
    await waitFor(() => {
      expect(usernameInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });
  });

  it('aplica estilos de error cuando hay validacion fallida', async () => {
    renderWithRouter(<Registro />);

    const emailInput = screen.getByPlaceholderText('Correo electronico');
    
    // Email inválido
    fireEvent.change(emailInput, { target: { value: 'mal-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(emailInput).toHaveClass('border-red-500');
      expect(screen.getByText('Correo invalido')).toHaveClass('text-red-500');
    });
  });
});