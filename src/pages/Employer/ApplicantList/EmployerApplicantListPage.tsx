import BaseHeader from '@/components/Common/Header/BaseHeader';
import EmployerApplicantList from '@/components/Employer/ApplicantList/EmployerApplicantList';
import { useNavigate } from 'react-router-dom';
import { useGetPostSummary } from '@/hooks/api/usePost';
import { useCurrentPostIdStore } from '@/store/url';
import { JobPostingCard } from '@/components/Common/JobPostingCard';
import { transformSummaryToJobPostingItemType } from '@/utils/post';
import LoadingPostItem from '@/components/Common/LoadingPostItem';

const EmployerApplicantListPage = () => {
  const navigate = useNavigate();
  const { currentPostId } = useCurrentPostIdStore();

  const { data, isLoading } = useGetPostSummary(
    Number(currentPostId),
    !isNaN(Number(currentPostId)) ? true : false,
  );

  const goToPostDetailPage = () => {
    navigate(`/employer/post/${currentPostId}`);
  };

  return (
    <>
      <BaseHeader
        hasBackButton={true}
        onClickBackButton={() => navigate('/employer/post')}
        hasMenuButton={false}
        title="지원자 확인"
      />
      <h2 className="mt-2 px-4 py-4 head-2 border-b border-[#f8f8f8] text-text-strong">
        내 공고 📋
      </h2>
      {isLoading ? (
        <div className="w-full h-56 flex justify-center items-center">
          <LoadingPostItem />
        </div>
      ) : (
        <>
          <JobPostingCard {...transformSummaryToJobPostingItemType(data?.data)}>
            <JobPostingCard.Box>
              <JobPostingCard.Header />
              <JobPostingCard.Title isTwoLine={true} />
              <div className="w-full py-2 flex flex-col gap-[0.125rem]">
                <JobPostingCard.Address />
                <JobPostingCard.WorkPeriod />
                <JobPostingCard.WorkDaysPerWeek />
              </div>
              <JobPostingCard.Footer />
            </JobPostingCard.Box>
          </JobPostingCard>
          <div className="w-full mb-2 py-2 flex justify-center">
            <button
              onClick={goToPostDetailPage}
              className="body-3 text-text-alternative underline cursor-pointer"
            >
              공고 상세보기
            </button>
          </div>
        </>
      )}
      <div className="w-full h-4 bg-surface-secondary"></div>
      <EmployerApplicantList />
    </>
  );
};

export default EmployerApplicantListPage;
