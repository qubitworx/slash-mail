import { create } from "zustand";

interface GlobalState {
  secret_key: string;
  setSecretKey: (secret_key: string) => void;
}

const useGlobalState = create((set) => ({
  secret_key: "",
  setSecretKey: (secret_key: string) => set({ secret_key }),
}));
