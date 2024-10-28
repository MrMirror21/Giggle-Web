import { AscendingSortType } from '@/types/common/sort';
import { api } from '.';
import { GetPostListReqType } from '@/types/api/post';

// 4.2 (게스트) 공고 상세 조회하기
export const getPostDetailGuest = async (id: number) => {
  const response = await api.get(`/guests/job-postings/${id}/details`);
  return response.data;
};

// 4.3 (유학생/고용주) 공고 리스트 조회
export const getPostList = async (req: GetPostListReqType) => {
  const response = await api.get(
    `/job-postings/overviews?page=${req.page}&size=${req.size}&search=${req.search}&sorting=${req.sorting}&region_1depth=${req.region_1depth}&region_2depth=${req.region_2depth}&region_3depth=${req.region_3depth}&industry=${req.industry}&work_period=${req.work_period}&work_days_per_week=${req.work_days_per_week}&working_day=${req.working_day}&working_hours=${req.working_hours}&recruitment_period=${req.recruitment_period}&employment_type=${req.employment_type}&visa=${req.visa}&type=${req.type}`,
  );
  return response.data;
};

// 4.4 (유학생/고용주) 공고 상세 조회하기
export const getPostDetail = async (id: number) => {
  const response = await api.get(`/api/v1/job-postings/${id}/details`);
  return response.data;
};

// 4.5 (유학생) 추천 공고 리스트 조회하기
export const getRecommendPostList = async () => {
  const response = await api.get(`/users/job-postings/briefs`);
  return response.data;
};

// 4.6 (고용주) 공고에 대한 지원자 리스트 조회
export const getApplicantList = async (
  id: number,
  sorting: string,
  status: string,
) => {
  // TODO: 무한 스크롤 구현하기
  const page = 1;
  const size = 10;
  const response = await api.get(
    `/api/v1/owners/job-postings/${id}/user-owner-job-postings/users/overviews?page=${page}&size=${size}&sorting=${sorting}&status=${status}`,
  );
  return response.data;
};

// 4.7 (유학생/고용주) 공고 요약 정보 조회하기
export const getPostSummary = async (id: number) => {
  const response = await api.get(`/api/v1/job-postings/${id}/summaries`);
  return response.data;
};

// 4.12 (유학생) 북마크 추가/삭제
export const putPostBookmark = async (id: number) => {
  const response = await api.put(`/users/job-postings/${id}/book-marks`);
  return response.data;
};

// 4.13 (고용주) 공고 삭제하기
export const deletePost = async (id: number) => {
  const response = await api.delete(`/api/v1/owners/job-postings/${id}`);
  return response.data;
};

// 5.1 (유학생) 북마크한 공고 리스트 조회하기
export const getBookmarkPostList = async (page: number, size: number) => {
  const response = await api.get(
    `/users/book-marks/overviews?page=${page}&size=${size}`,
  );
  return response.data;
};

// 6.3 (유학생) 현재 진행중인 인터뷰 리스트 조회하기
export const getInterviewList = async (page: number, size: number) => {
  const response = await api.get(
    `/users/user-owner-job-postings/briefs?page=${page}&size=${size}`,
  );
  return response.data;
};

// 6.6 (고용주) 등록한 공고 리스트 조회하기
export const getEmployerPostList = async (sorting: AscendingSortType) => {
  // TODO: 무한 스크롤 구현하기
  const page = 1;
  const size = 10;
  const response = await api.get(
    `/api/v1/owners/job-postings/overviews?page=${page}&size=${size}&sorting=${sorting}`,
  );
  return response.data;
};
