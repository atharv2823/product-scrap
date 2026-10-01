import { create } from 'zustand';

export type SignupRole = 'hunter' | 'arbitrageur' | 'developer';
export type RegStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface SignupState {
  firstName: string;
  lastName: string;
  age: number | string;
  fullName: string;
  email: string;
  password: string;
  showPassword: boolean;
  role: SignupRole;
  agreeTerms: boolean;
  soundEnabled: boolean;
  regStatus: RegStatus;
  statusMessage: string;

  // Setters & Actions
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setAge: (age: number | string) => void;
  setFullName: (fullName: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (showPassword: boolean | ((prev: boolean) => boolean)) => void;
  toggleShowPassword: () => void;
  setRole: (role: SignupRole) => void;
  setAgreeTerms: (agreeTerms: boolean) => void;
  setSoundEnabled: (soundEnabled: boolean | ((prev: boolean) => boolean)) => void;
  toggleSoundEnabled: () => void;
  setRegStatus: (regStatus: RegStatus) => void;
  setStatusMessage: (statusMessage: string) => void;
  fillDemo: () => void;
  resetForm: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  firstName: '',
  lastName: '',
  age: 24,
  fullName: '',
  email: '',
  password: '',
  showPassword: false,
  role: 'hunter',
  agreeTerms: true,
  soundEnabled: true,
  regStatus: 'idle',
  statusMessage: '',

  setFirstName: (firstName) =>
    set((state) => ({
      firstName,
      fullName: `${firstName} ${state.lastName}`.trim(),
    })),
  setLastName: (lastName) =>
    set((state) => ({
      lastName,
      fullName: `${state.firstName} ${lastName}`.trim(),
    })),
  setAge: (age) => set({ age }),
  setFullName: (fullName) => {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    set({ fullName, firstName, lastName });
  },
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setShowPassword: (showPassword) =>
    set((state) => ({
      showPassword:
        typeof showPassword === 'function' ? showPassword(state.showPassword) : showPassword,
    })),
  toggleShowPassword: () => set((state) => ({ showPassword: !state.showPassword })),
  setRole: (role) => set({ role }),
  setAgreeTerms: (agreeTerms) => set({ agreeTerms }),
  setSoundEnabled: (soundEnabled) =>
    set((state) => ({
      soundEnabled:
        typeof soundEnabled === 'function' ? soundEnabled(state.soundEnabled) : soundEnabled,
    })),
  toggleSoundEnabled: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setRegStatus: (regStatus) => set({ regStatus }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  fillDemo: () =>
    set({
      firstName: 'Jhon',
      lastName: 'Deo',
      fullName: 'Jhon Deo',
      age: 24,
      email: 'rahul@gmail.com',
      password: 'pass123',
      role: 'arbitrageur',
    }),
  resetForm: () =>
    set({
      firstName: '',
      lastName: '',
      fullName: '',
      age: 24,
      email: '',
      password: '',
      showPassword: false,
      role: 'hunter',
      agreeTerms: true,
      soundEnabled: true,
      regStatus: 'idle',
      statusMessage: '',
    }),
}));
