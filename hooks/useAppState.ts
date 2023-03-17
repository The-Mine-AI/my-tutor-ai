// Description: This file contains the state of the app

import { StateCreator, create } from "zustand"

export type AppStore = {
}

export const createAppStore: StateCreator<AppStore> = (set) => ({

})

export const useAppState = create<
    AppStore
>()((...args) => ({
  ...createAppStore(...args)
}));