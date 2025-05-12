import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAxios } from "./axios";


export type TApiError = {
  data: string;
  statusCode: number;
  message: string;
  response: {
    data: {
      data: string;
      message: string;
      statusCode: number;
    };
    statusCode: number;
    message: string;
  };
};

// Hook options types
interface QueryProps<TData> {
  key: QueryKey;
  url: string;
  headers?: Record<string, string | null | undefined>;
  options?: Omit<
    UseQueryOptions<TData, Error>,
    "queryKey" | "queryFn"
  >;
  onErrorCallback?: (error: AxiosError) => void;
}

// Hook options types
interface MutationProps<TData = unknown, TVariables = void> {
  method: "post" | "put" | "delete" | "patch";
  url: string;
  onSuccessMessage?: string;
  key?: QueryKey;
  options?: UseMutationOptions<TData, AxiosError, TVariables>;
  headers?: object;
  contentType?: "aplication/json" | "multipart/form-data";
  onErrorCallback?: (error: AxiosError) => void;
  onSuccessCallback?: (data: TData) => void;
}

// GET Query Hook
export function useGetQuery<TData = unknown>({
  key,
  url,
  headers,
  options = {},
}: QueryProps<TData>): UseQueryResult<TData, Error> {
  const axios = useAxios();

  const queryOptions: UseQueryOptions<TData, Error> = {
    queryKey: key,
    queryFn: async () => {
      const response = await axios.get<TData>(url, {
        headers,
      });
      return response.data;
    },
    ...options,
  };

  return useQuery<TData>(queryOptions);
}

function useCustomMutation<TData, TVariables>(
  mutationFn: (values: TVariables) => Promise<TData>,
  {
    key,
    onSuccessCallback,
    onErrorCallback,
    options,
  }: MutationProps<TData, TVariables>
) {
  const queryClient = useQueryClient();

  const mutation = useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    onSuccess: async (data) => {
      if (key) {
        await queryClient.invalidateQueries({ queryKey: key });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },

    onError: (error: AxiosError) => {
      onErrorCallback?.(error);
    },
    ...options,
  });

  return mutation;
}

// Mutation Hook
export function useMutationAction<TData = unknown, TVariables = unknown>(
  props: MutationProps<TData, TVariables>
) {
  const axios = useAxios(props.contentType);

  return useCustomMutation<TData, TVariables>(
    async (values: TVariables): Promise<TData> => {
      const response = await axios[props.method]<TData>(
        props.url,
        values,
        { headers: props.headers }
      );

      return response.data;
    },
    props
  );
}
