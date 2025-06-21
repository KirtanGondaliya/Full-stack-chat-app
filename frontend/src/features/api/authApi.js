import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.MODE ==="devlopement"? "http://localhost:5001/api":"/api",
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    checkAuth: builder.query({
      query: () => "/auth/check",
      providesTags: ["Auth"],
    }),
    singUpUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "Post",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "Post",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
    logOutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "Post",
      }),
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useCheckAuthQuery,
  useSingUpUserMutation,
  useLogOutUserMutation,
  useLoginUserMutation,
} = authApi;
