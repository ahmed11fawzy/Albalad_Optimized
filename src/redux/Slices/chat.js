import { coreApi } from "./coreApi";

export const chatsApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: `/chats`,
        method: "GET",
      }),
      providesTags: ["Chats"],
    }),
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/chats/messages/${conversationId}`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
    sendMessage: builder.mutation({
      query: (message) => ({
        url: `/chats/send`,
        method: "POST",
        body: message,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatsApi;
