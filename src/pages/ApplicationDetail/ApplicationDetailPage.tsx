import ApplicationDetailStep1 from '@/components/ApplicationDetail/ApplicationDetailStep1';
import ApplicationDetailStep2 from '@/components/ApplicationDetail/ApplicationDetailStep2';
import ApplicationDetailStep3 from '@/components/ApplicationDetail/ApplicationDetailStep3';
import ApplicationDetailStep4 from '@/components/ApplicationDetail/ApplicationDetailStep4';
import ApplicationDetailStep5 from '@/components/ApplicationDetail/ApplicationDetailStep5';
import ApplicationDetailStep6 from '@/components/ApplicationDetail/ApplicationDetailStep6';
import ApplicationDetailSteps from '@/components/ApplicationDetail/ApplicationDetailSteps';
import BaseHeader from '@/components/Common/Header/BaseHeader';
import ApplicationDetailStep7 from '@/components/ApplicationDetail/ApplicationDetailStep7';
import { findCurrentStep } from '@/utils/application';
import ApplicationDetailStepEtc from '@/components/ApplicationDetail/ApplicationDetailStepEtc';
import { useGetApplicationDetail } from '@/hooks/api/useApplication';
import { useCurrentPostIdEmployeeStore } from '@/store/url';
import useNavigateBack from '@/hooks/useNavigateBack';
import { JobPostingCard } from '@/components/Common/JobPostingCard';
import LoadingPostItem from '@/components/Common/LoadingPostItem';
import { transformApplicationDetailToJobPostingItemType } from '@/utils/post';

const ApplicationDetailPage = () => {
  const handleBackButtonClick = useNavigateBack();
  const { currentPostId: currentEmployeePostId } =
    useCurrentPostIdEmployeeStore();

  const { data: applicationData, isLoading } = useGetApplicationDetail(
    Number(currentEmployeePostId),
    !isNaN(Number(currentEmployeePostId)) ? true : false,
  );

  const showCurrentStepButton = (step: number) => {
    switch (step) {
      case 1:
        return <ApplicationDetailStep1 />;
      case 2:
        return <ApplicationDetailStep2 />;
      case 3:
        return (
          <ApplicationDetailStep3
            applicant_id={Number(currentEmployeePostId)}
          />
        );
      case 4:
        return <ApplicationDetailStep4 />;
      case 5:
        return <ApplicationDetailStep5 />;
      case 6:
        return <ApplicationDetailStep6 />;
      case 7:
        return <ApplicationDetailStep7 />;
      default:
        return (
          <ApplicationDetailStepEtc result={applicationData?.data?.step} />
        );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <BaseHeader
        hasBackButton={true}
        onClickBackButton={handleBackButtonClick}
        hasMenuButton={false}
        title="Check Status"
      />
      {isLoading ? (
        <div className="w-full h-56 flex justify-center items-center">
          <LoadingPostItem />
        </div>
      ) : (
        <>
          <JobPostingCard
            {...transformApplicationDetailToJobPostingItemType(
              applicationData?.data,
            )}
          >
            <JobPostingCard.Box>
              <JobPostingCard.Header isBookMarkButton={false} />
              <JobPostingCard.CompanyInfo />
              <div className="pt-4">
                <JobPostingCard.HourlyRate />
              </div>
              <JobPostingCard.WorkDayInfo />
            </JobPostingCard.Box>
          </JobPostingCard>
          <div className="w-full h-4 bg-surface-secondary"></div>
          <ApplicationDetailSteps step={applicationData?.data?.step} />
          {showCurrentStepButton(findCurrentStep(applicationData?.data?.step))}
        </>
      )}
    </div>
  );
};

export default ApplicationDetailPage;
