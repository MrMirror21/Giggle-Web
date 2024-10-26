import {
  postIntegratedApplications,
  postPartTimeEmployPermit,
  postStandardLaborContracts,
  putIntegratedApplications,
  putPartTimeEmployPermit,
  putStandardLaborContracts,
  searchSchool,
} from '@/api/document';
import { DocumentType, SearchSchoolResponse } from '@/types/api/document';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

//시간제취업허가서 작성 api 통신 커스텀 훅
export const usePostPartTimeEmployPermit = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: postPartTimeEmployPermit,
    onSuccess: () => {
      navigate('/');
    },
    onError: () =>
      navigate('/write-documents', {
        state: {
          type: DocumentType.PART_TIME_PERMIT,
        },
      }),
  });
};

// 8.10 (유학생)시간제취업허가서 수정 api 통신 커스텀 훅
export const usePutPartTimeEmployPermit = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: putPartTimeEmployPermit,
    onSuccess: () => {
      navigate('/');
    },
    onError: () =>
      navigate('/write-documents', {
        state: {
          type: DocumentType.PART_TIME_PERMIT,
        },
      }),
  });
};

//표준 근로계약서 작성 api 통신 커스텀 훅
export const usePostStandardLaborContracts = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: postStandardLaborContracts,
    onSuccess: () => {
      navigate('/');
    },
    onError: () =>
      navigate('/write-documents', {
        state: {
          type: DocumentType.LABOR_CONTRACT,
        },
      }),
  });
};

// 8.12 (유학생) 표준 근로계약서 수정 api 통신 커스텀 훅
export const usePutStandardLaborContracts = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: putStandardLaborContracts,
    onSuccess: () => {
      navigate('/');
    },
    onError: () =>
      navigate('/write-documents', {
        state: {
          type: DocumentType.LABOR_CONTRACT,
        },
      }),
  });
};

// 8.8 통합신청서 생성 api 통신 커스텀 훅
export const usePostIntegratedApplicants = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: postIntegratedApplications,
    onSuccess: () => {
      navigate('/');
    },
    onError: () =>
      navigate('/write-documents', {
        state: {
          type: DocumentType.INTEGRATED_APPLICATION,
        },
      }),
  });
};

// 8.14 (유학생) 통합신청서 수정 api 통신 커스텀 훅
export const usePutIntegratedApplicants = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: putIntegratedApplications,
    onSuccess: () => {
      navigate('/');
    },
    onError: () =>
      navigate('/write-documents', {
        state: {
          type: DocumentType.INTEGRATED_APPLICATION,
        },
      }),
  });
};

// 9.1 (유학생) 학교 검색하기 api 통신 커스텀 훅
export const useSearchSchool = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: SearchSchoolResponse) => void;
  onError?: (error: unknown) => void;
}) => {
  const { mutate, ...rest } = useMutation({
    mutationFn: searchSchool,
    onSuccess,
    onError: (error) => {
      console.error('학교 검색 중 오류 발생:', error);
      onError?.(error);
    },
  });
  return { searchSchool: mutate, ...rest };
};
