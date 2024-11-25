import { useGetOwnerApplicationCounts } from '@/hooks/api/useProfile';
import { EmployerCountsInfoResponse } from '@/types/api/profile';
import { useEffect, useState } from 'react';

const EmployerJobInfo = () => {
  const { data } = useGetOwnerApplicationCounts();
  const [jobData, setJobData] = useState<EmployerCountsInfoResponse>();

  useEffect(() => {
    if (data) {
      setJobData(data.data);
    }
  }, [data]);

  return (
    <>
      {jobData && (
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-3 w-24 py-2 px-1">
            <div className="body-3 text-[#1E1926] text-center">올린 공고</div>
            <div className="head-3 text-[#1E1926] text-center">
              {jobData.job_postings_counts}
            </div>
          </div>
          <div className="flex flex-col gap-3 py-2 px-1">
            <div className="body-3 text-[#1E1926] text-center">지원자 총합</div>
            <div className="head-3 text-[#1E1926] text-center">
              {jobData.applicants_counts}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-24 py-2 px-1">
            <div className="body-3 text-[#1E1926] text-center">계약 성공</div>
            <div className="head-3 text-[#1E1926] text-center">
              {jobData.successful_hire_counts}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployerJobInfo;
