import { POST_SEARCH_MENU } from '@/constants/postSearch';
import { ApplicationStatusType } from '@/types/application/applicationStatus';
import {
  MatchAscendingSortType,
  MatchKoEnAscendingSortType,
} from '@/types/common/sort';
import { JobPostingItemType } from '@/types/common/jobPostingItem';

export type GetPostListReqType = {
  size: number;
  search?: string | null;
  sorting?: string | null;
  region_1depth?: string | null;
  region_2depth?: string | null;
  region_3depth?: string | null;
  industry?: string | null;
  work_period?: string | null;
  work_days_per_week?: string | null;
  working_day?: string | null;
  working_hours?: string | null;
  recruitment_period?: string | null;
  employment_type?: string | null;
  visa?: string | null;
  type?: POST_SEARCH_MENU | null;
};

export type GetApplyPostListReqType = {
  page?: number;
  size: number;
  sorting: MatchAscendingSortType;
  status: ApplicationStatusType | null;
};

export type GetEmployerPostListReqType = {
  page?: number;
  size: number;
  sorting: MatchKoEnAscendingSortType;
};

// 4.3 (유학생/고용주) 공고 리스트 조회 훅 response
export type GetPostListResponse = {
  data: {
    job_posting_list: JobPostingItemType[];
    has_next: boolean;
  };
};
