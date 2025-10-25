import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Login from '../src/components/Login/Login';
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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza el formulario de login', () => {
    renderWithRouter(<Login />);

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('muestra errores de validacion para campos vacios', async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El correo electrónico es requerido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
    });
  });

  it('muestra error para formato de email invalido', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });
  });

  it('muestra error de validacion de longitud minima', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    fireEvent.change(emailInput, { target: { value: 'a@' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Mínimo 3 caracteres')).toBeInTheDocument();
    });
  });

  it('muestra error cuando las credenciales son invalidas', async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { 
      target: { value: 'user@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { 
      target: { value: 'wrongpassword' } 
    });

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Buscar el mensaje de error específico en el div de error
      expect(screen.getByText('Credenciales invalidas')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('redirige al dashboard cuando el login de admin es exitoso', async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { 
      target: { value: 'admin@zonagamer.cl' } 
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { 
      target: { value: 'zonagameradmin' } 
    });

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 3000 });
  });

  it('guarda el estado de admin en localStorage cuando login es exitoso', async () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { 
      target: { value: 'admin@zonagamer.cl' } 
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { 
      target: { value: 'zonagameradmin' } 
    });

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verificar que se guardó en localStorage
      expect(localStorage.getItem('true')).toBe('true');
    }, { timeout: 3000 });
  });

  it('aplica estilos de error cuando hay validacion fallida', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    fireEvent.change(emailInput, { target: { value: 'invalido' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(emailInput).toHaveClass('border-red-500');
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });
  });

  it('renderiza el link de registro', () => {
    renderWithRouter(<Login />);

    const registerLink = screen.getByRole('link', { name: /regístrate/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/registro');
  });

  it('no muestra mensaje de error de credenciales invalidas inicialmente', () => {
    renderWithRouter(<Login />);

    // Verificar que NO existe el mensaje de error específico
    expect(screen.queryByText('Credenciales invalidas')).not.toBeInTheDocument();
    
    // Pero SÍ existe el mensaje de ayuda normal
    expect(screen.getByText('Ingresa tus credenciales para continuar')).toBeInTheDocument();
  });

  it('los campos tienen validacion de react-hook-form', () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Verificar que tienen atributos de react-hook-form
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(passwordInput).toHaveAttribute('name', 'password');
    
    // Verificar que tienen aria-invalid en false inicialmente
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('muestra el mensaje de ayuda en el formulario', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText('Ingresa tus credenciales para continuar')).toBeInTheDocument();
  });

  it('los campos cambian su estado de validacion despues de un error', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    
    // Provocar error
    fireEvent.change(emailInput, { target: { value: 'invalido' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });

    // Corregir el error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('el formulario tiene autocomplete configurado', () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    expect(emailInput).toHaveAttribute('autocomplete', 'email');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });
});