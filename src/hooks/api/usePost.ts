import {
  createPost,
  deletePost,
  editPost,
  getApplicantList,
  getApplyPostList,
  getEmployerPostList,
  getPostDetail,
  getPostDetailGuest,
  getPostList,
  getPostListGuest,
  getPostSummary,
  putPostBookmark,
} from '@/api/post';
import { RESTYPE } from '@/types/api/common';
import {
  GetApplyPostListReqType,
  GetEmployerPostListReqType,
  GetPostListReqType,
} from '@/types/api/post';
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { smartNavigate } from '@/utils/application';
import { useNavigate } from 'react-router-dom';
import { initialJobPostingState } from '@/types/postCreate/postCreate';
import { mapPostDetailDataToFormData } from '@/utils/post';

// 4.1 (게스트) 공고 리스트 조회 훅
export const useGetPostGuestList = (
  req: GetPostListReqType,
  isEnabled: boolean,
  page: number = 1,
) => {
  return useQuery({
    queryKey: ['post', 'guest', req],
    queryFn: () => getPostListGuest(req, page),
    enabled: isEnabled,
    staleTime: 0,
  });
};

// 4.1 (게스트) 공고 리스트 조회 - 무한스크롤
export const useInfiniteGetPostGuestList = (
  req: GetPostListReqType,
  isEnabled: boolean,
) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['post', 'guest', req],
      queryFn: ({ pageParam = 1 }) => getPostListGuest(req, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.data.has_next ? allPage.length + 1 : undefined;
      },
      enabled: isEnabled,
      retry: 1,
    });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage: data?.pages[data?.pages.length - 1].data.has_next,
    isFetchingNextPage,
  };
};

// 4.2 (게스트) 공고 상세 조회하기 훅
export const useGetPostDetailGuest = (id: number, isEnabled: boolean) => {
  return useQuery({
    queryKey: ['post', 'guest', id],
    queryFn: () => getPostDetailGuest(id),
    enabled: isEnabled,
  });
};

// 4.3 (유학생/고용주) 공고 리스트 조회 훅
export const useGetPostList = (
  req: GetPostListReqType,
  isEnabled: boolean,
  page: number = 1,
) => {
  return useQuery({
    queryKey: ['post', req],
    queryFn: () => getPostList(req, page),
    enabled: isEnabled,
    staleTime: 0,
  });
};

// 4.3 (유학생/고용주) 공고 리스트 조회 - 무한 스크롤
export const useInfiniteGetPostList = (
  req: GetPostListReqType,
  isEnabled: boolean,
) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['post', req],
      queryFn: ({ pageParam = 1 }) => getPostList(req, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.data.has_next ? allPage.length + 1 : undefined;
      },
      enabled: isEnabled,
      retry: 1,
    });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage: data?.pages[data?.pages.length - 1].data.has_next,
    isFetchingNextPage,
  };
};

// 4.4 (유학생/고용주) 공고 상세 조회하기 훅
export const useGetPostDetail = (id: number, isEnabled: boolean) => {
  return useQuery({
    queryKey: ['post', 'detail', id],
    queryFn: () => getPostDetail(id),
    enabled: isEnabled,
  });
};

// 4.6 (고용주) 공고에 대한 지원자 리스트 조회 훅
export const useGetApplicantList = (
  id: number,
  sorting: string,
  status: string | null,
  isEnabled: boolean,
) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['post', id, sorting, status],
      queryFn: ({ pageParam = 1 }) =>
        getApplicantList(pageParam, id, sorting, status), // API 호출 함수
      initialPageParam: 1, // 첫 페이지 설정
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.data.has_next ? allPage.length + 1 : undefined;
      },
      enabled: isEnabled,
      retry: 1, // 실패 시 재시도 횟수
    });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage: data?.pages[data?.pages.length - 1].data.has_next,
    isFetchingNextPage,
  };
};

// 4.7 (유학생/고용주) 공고 요약 정보 조회하기 훅
export const useGetPostSummary = (id: number, isEnabled: boolean) => {
  return useQuery({
    queryKey: ['post', 'summary', id],
    queryFn: () => getPostSummary(id),
    enabled: isEnabled,
  });
};

// 4.10 (고용주) 공고 등록하기 훅
export const useCreatePost = (
  options?: UseMutationOptions<RESTYPE<{ id: number }>, Error, FormData>,
) => {
  return useMutation({
    mutationFn: createPost,
    onError: (error) => {
      console.error('공고 등록하기 실패', error);
    },
    ...options,
  });
};

// 4.10 (고용주) 공고 수정하기 훅
export const useEditPost = (
  options?: UseMutationOptions<
    RESTYPE<{ id: number }>,
    Error,
    { newPost: FormData; id: number }
  >,
) => {
  return useMutation({
    mutationFn: editPost,
    onError: (error) => {
      console.error('공고 수정하기 실패', error);
    },
    ...options,
  });
};

// 4.12 (유학생) 북마크 추가/삭제 훅
export const usePutPostBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putPostBookmark,
    onError: (error) => {
      console.error('북마크 추가/삭제 실패', error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['post'],
      });
    },
    meta: { skipGlobalLoading: true },
  });
};

// 4.13 (고용주) 공고 삭제하기 훅
export const useDeletePost = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      smartNavigate(navigate, '/employer/post');
    },
    onError: (error) => {
      console.error('공고 삭제하기 실패', error);
    },
  });
};

// 6.1 (유학생) 지원한 공고 리스트 조회하기 훅
export const useGetApplyPostList = ({
  size,
  sorting,
  status,
}: GetApplyPostListReqType) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['post', 'apply', sorting, status],
      queryFn: ({ pageParam = 1 }) =>
        getApplyPostList({ page: pageParam, size, sorting, status }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.data.has_next ? allPage.length + 1 : undefined;
      },
      retry: 1,
    });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage: data?.pages[data?.pages.length - 1].data.has_next,
    isFetchingNextPage,
  };
};

// 6.6 (고용주) 등록한 공고 리스트 조회하기 훅
export const useGetEmployerPostList = ({
  size,
  sorting,
}: GetEmployerPostListReqType) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['post', 'owner', sorting],
      queryFn: ({ pageParam = 1 }) =>
        getEmployerPostList({ page: pageParam, size, sorting }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.data.has_next ? allPage.length + 1 : undefined;
      },
      retry: 1,
    });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage: data?.pages[data?.pages.length - 1].data.has_next,
    isFetchingNextPage,
  };
};

// 4.4 (유학생/고용주) 폼을 위한 공고 상세 조회하기 훅 (useMutation 버전)
export const useGetPostDetailForForm = () => {
  return useMutation({
    mutationFn: async ({ id, isEdit }: { id?: number; isEdit?: boolean }) => {
      if (!id || !isEdit) return { data: initialJobPostingState };

      const response = await getPostDetail(id);
      return {
        data: mapPostDetailDataToFormData(response.data),
        originalData: response.data,
      };
    },
  });
};
