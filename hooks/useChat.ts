// Description: This file contains the state of the app

import { StateCreator, create } from "zustand"

export type ChatStore = {
  book?: string,
  chapter?: string,
  topic?: string,
  // messages?: ChatCompletionRequestMessage[],

  setBook: (book?: string) => void,
  setChapter: (chapter?: string) => void,
  setTopic: (topic?: string) => void,
  // setMessages: (messages?: ChatCompletionRequestMessage[]) => void,
}

export const createChatStore: StateCreator<ChatStore> = (set) => ({
  setBook: (book) => set({ book, chapter: undefined, topic: undefined }),
  setChapter: (chapter) => set({ chapter, topic: undefined }),
  setTopic: (topic) => set({ topic }),
  // setMessages: (messages) => set({ messages }),
})

export const useChatState = create<
  ChatStore
>()((...args) => ({
  ...createChatStore(...args)
}));