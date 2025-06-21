import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.MODE === "devlopement"
        ? "http://localhost:5001/api"
        : "/api",
    credentials: "include",
  }),
  tagTypes: ["msg", "users"],

  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/messages/users",
      providesTags: ["users"],
    }),

    getMessages: builder.query({
      query: (userId) => `/messages/${userId}`,
      providesTags: (result, error, userId) => [{ type: "msg", id: userId }],
    }),

    sendMessages: builder.mutation({
      query: ({ id, data }) => ({
        url: `/messages/send/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "msg", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetMessagesQuery,
  useSendMessagesMutation,
} = chatApi;
