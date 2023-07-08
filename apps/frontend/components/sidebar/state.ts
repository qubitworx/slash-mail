import { create } from "zustand";

interface ISidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useSidebarState = create<ISidebarState>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useSidebarState;
