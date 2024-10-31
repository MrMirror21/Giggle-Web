import SearchSortDropdown from '@/components/Common/SearchSortDropdown';
import EmployerApplicationCard from '@/components/Employer/ApplicantList/EmployerApplicantCard';
import {
  EN_APPLICATION_STATUS_TYPE,
  KO_APPLICATION_STATUS_TYPE,
} from '@/constants/application';
import {
  KO_ASCENDING_SORT_TYPE,
  MATCH_KO_EN_ASCENDING_SORT,
} from '@/constants/sort';
import { useGetApplicantList } from '@/hooks/api/usePost';
import { ApplicantItemType } from '@/types/application/applicationItem';
import { KoApplicationStatusType } from '@/types/application/applicationStatus';
import { KoAscendingSortType } from '@/types/common/sort';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type EmployerApplicationListPropsType = {
  title: string;
};

const EmployerApplicationList = ({
  title,
}: EmployerApplicationListPropsType) => {
  const { id } = useParams();

  const [selectedSort, setSelectedSort] = useState<KoAscendingSortType>(
    KO_ASCENDING_SORT_TYPE.ASCENDING,
  );
  const [selectedStatus, setSelectedStatus] = useState<KoApplicationStatusType>(
    KO_APPLICATION_STATUS_TYPE.TOTAL,
  );

  const { data, refetch } = useGetApplicantList(
    Number(id),
    MATCH_KO_EN_ASCENDING_SORT[selectedSort],
    EN_APPLICATION_STATUS_TYPE[selectedStatus],
    !isNaN(Number(id)) ? true : false,
  );

  useEffect(() => {
    if (!isNaN(Number(id))) refetch();
  }, [id, selectedSort, selectedStatus, refetch]);

  if (!data?.success) return <></>;

  return (
    <section className="flex flex-col gap-[1rem] w-full p-[1.5rem] pb-[6.25rem]">
      <div className="flex justify-between items-center">
        <h3 className="px-[0.5rem] head-3 text-[#1E1926]">
          <span className="pr-[0.25rem] text-[#7872ED]">{title}</span>의 지원자
        </h3>
        <div className="flex gap-[0.25rem] whitespace-nowrap">
          <SearchSortDropdown
            options={Object.values(KO_ASCENDING_SORT_TYPE)}
            value={selectedSort}
            onSelect={(sort) => setSelectedSort(sort as KoAscendingSortType)}
          />
          <SearchSortDropdown
            options={Object.values(KO_APPLICATION_STATUS_TYPE)}
            value={selectedStatus}
            onSelect={(sort) =>
              setSelectedStatus(sort as KoApplicationStatusType)
            }
          />
        </div>
      </div>
      {data?.data?.applicant_list?.map((data: ApplicantItemType) => (
        <EmployerApplicationCard key={data.id} applicantData={data} />
      ))}
    </section>
  );
};

export default EmployerApplicationList;
