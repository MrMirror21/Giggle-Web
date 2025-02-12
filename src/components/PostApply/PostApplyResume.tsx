import ProfilePicture from '@/components/ManageResume/ProfilePicture';
import InfoCardLayout from '@/components/Common/InfoCardLayout';
import {
  EducationType,
  LanguageType,
  WorkExperienceType,
} from '@/types/postApply/resumeDetailItem';
import { useGetApplicantResume, useGetResume } from '@/hooks/api/useResume';
import { useUserStore } from '@/store/user';
import { UserType } from '@/constants/user';
import { useCurrentApplicantIdStore } from '@/store/url';
import LoadingItem from '@/components/Common/LoadingItem';
import YellowDocumentIcon from '@/assets/icons/YellowDocumentIcon.svg?react';
import { infoTranslation } from '@/constants/translation';
import { isEmployer } from '@/utils/signup';
import { useLocation } from 'react-router-dom';

const EDUCATION_PERIOD = {
  BACHELOR: 4,
  ASSOCIATE: 2,
  HIGHSCHOOL: 3,
} as const;

const PostApplyResume = () => {
  const { pathname } = useLocation();

  const { currentApplicantId } = useCurrentApplicantIdStore();
  const { account_type } = useUserStore();

  const { data: userData, isPending: userDataPending } = useGetResume(
    account_type === UserType.USER,
  );
  const { data: ownerData, isPending: ownerDataPending } =
    useGetApplicantResume(
      Number(currentApplicantId),
      !isNaN(Number(currentApplicantId)) && account_type === UserType.OWNER
        ? true
        : false,
    );

  const data = account_type === UserType.OWNER ? ownerData : userData;
  const isPending =
    account_type === UserType.OWNER ? ownerDataPending : userDataPending;

  if (isPending) return <LoadingItem />;
  else if (!data?.success) return <></>;

  return (
    <>
      <section className="py-5 px-4">
        <ProfilePicture
          name={data.data.name}
          profileImg={data.data.profile_img_url}
        />
      </section>
      <section className="flex flex-col p-4 gap-2 bg-[#F4F4F9] pb-32">
        <InfoCardLayout
          icon={<YellowDocumentIcon />}
          title="Visa"
          rightTopElement={
            <p>
              <span className="mr-2 button-2 text-[#252525]">
                {data.data?.visa.visa.replace(/_/g, '-')}
              </span>
              <span className="body-3 text-[#9397A1]">
                {data.data?.visa.description}
              </span>
            </p>
          }
        ></InfoCardLayout>
        <InfoCardLayout
          icon={<YellowDocumentIcon />}
          title="Personal Information"
        >
          <div className="flex flex-col gap-2">
            <div className="w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h4 className="px-[0.25rem] pb-[0.375rem] button-2 text-[#252525]">
                Gender
              </h4>
              <p className="px-[0.25rem] body-3 text-[#252525]">
                {data?.data?.personal_information.main_address}
              </p>
            </div>
            <div className="w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h4 className="px-[0.25rem] pb-[0.375rem] button-2 text-[#252525]">
                Date of birth
              </h4>
              <p className="px-[0.25rem] body-3 text-[#252525]">
                {data?.data?.personal_information?.main_address ??
                  infoTranslation.notEntered[isEmployer(pathname)]}
              </p>
            </div>
            <div className="w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h4 className="px-[0.25rem] pb-[0.375rem] button-2 text-[#252525]">
                Nationality
              </h4>
              <p className="px-[0.25rem] body-3 text-[#252525]">
                {data?.data?.personal_information.main_address ??
                  infoTranslation.notEntered[isEmployer(pathname)]}
              </p>
            </div>
            <div className="w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h4 className="px-[0.25rem] pb-[0.375rem] button-2 text-[#252525]">
                Phone Number
              </h4>
              <p className="px-[0.25rem] body-3 text-[#252525]">
                {data?.data?.personal_information.phone_number}
              </p>
            </div>
            <div className="w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h4 className="px-[0.25rem] pb-[0.375rem] button-2 text-[#252525]">
                Email
              </h4>
              <p className="px-[0.25rem] body-3 text-[#252525]">
                {data?.data?.personal_information.email}
              </p>
            </div>
            <div className="w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h4 className="px-[0.25rem] pb-[0.375rem] button-2 text-[#252525]">
                Address
              </h4>
              <p className="px-[0.25rem] body-3 text-[#252525]">
                {data?.data?.personal_information?.main_address
                  ? `${data?.data?.personal_information.main_address}, ${data?.data?.personal_information.detailed_address}`
                  : infoTranslation.notEntered[isEmployer(pathname)]}
              </p>
            </div>
          </div>
        </InfoCardLayout>
        <InfoCardLayout icon={<YellowDocumentIcon />} title="Introduction">
          <p className="pb-2 body-3 text-[#9397A1]">나를 한 줄로 표현한다면?</p>
          <p className="pb-2 body-3 text-[#252525]">
            {data?.data?.introduction?.length > 0
              ? data.data.introduction
              : infoTranslation.notEntered[isEmployer(pathname)]}
          </p>
        </InfoCardLayout>
        <InfoCardLayout icon={<YellowDocumentIcon />} title="Work Experience">
          <div className="flex flex-col gap-2">
            {data?.data?.work_experience?.length > 0 ? (
              data?.data?.work_experience?.map((data: WorkExperienceType) => (
                <div
                  key={data.id}
                  className="w-full p-4 rounded-lg bg-[#F4F4F9]"
                >
                  <h5 className="pb-[0.125rem] button-2 text-[#252525]">
                    {data.title}
                  </h5>
                  <p className="pb-2 caption-1 text-[#252525]">
                    {data.description}
                  </p>
                  <div className="flex gap-[0.5rem] caption-1">
                    <p className="text-[#656565]">
                      {data.start_date}~{data.end_date ?? ''}
                    </p>
                    <p className="text-[#5592FC]">{data.duration} months</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="pb-2 body-3 text-[#252525]">
                {infoTranslation.notEntered[isEmployer(pathname)]}
              </p>
            )}
          </div>
        </InfoCardLayout>
        <InfoCardLayout icon={<YellowDocumentIcon />} title="Education">
          <div className="flex flex-col gap-2">
            {data?.data?.education?.length > 0 ? (
              data?.data?.education?.map((data: EducationType) => (
                <div key={data.id} className="p-4">
                  <div className="flex justify-between items-center pb-[0.125rem]">
                    <h5 className="button-2 text-[#252525]">
                      {data.school_name}
                    </h5>
                    <div className="px-1 py-[0.188rem] rounded-sm text-[#0066FF] bg-[#0066FF1F] caption-2">
                      {EDUCATION_PERIOD[data.education_level]} years program
                    </div>
                  </div>
                  <p className="pb-2 caption-1 text-[#252525]">{data.major}</p>
                  <div className="flex gap-[0.5rem] caption-1">
                    <p className="text-[#656565]">
                      {data.start_date}~{data.end_date}
                    </p>
                    <p className="text-[#5592FC]">{data.grade}th grade</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="pb-2 body-3 text-[#252525]">
                {infoTranslation.notEntered[isEmployer(pathname)]}
              </p>
            )}
          </div>
        </InfoCardLayout>
        <InfoCardLayout icon={<YellowDocumentIcon />} title="Languages">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h5 className="pb-[0.125rem] button-2 text-[#464646]">TOPIK</h5>
              <div className="px-1 py-[0.188rem] rounded-sm text-[#0066FF] bg-[#0066FF1F] caption-2">
                LEVEL {data?.data?.languages.topik}
              </div>
            </div>
            <div className="flex justify-between items-center w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h5 className="pb-[0.125rem] button-2 text-[#464646]">
                Social Intergration
              </h5>
              <div className="px-1 py-[0.188rem] rounded-sm text-[#0066FF] bg-[#0066FF1F] caption-2">
                LEVEL {data?.data?.languages.social_integration}
              </div>
            </div>
            <div className="flex justify-between items-center w-full p-4 rounded-lg bg-[#F4F4F9]">
              <h5 className="pb-[0.125rem] button-2 text-[#464646]">
                Sejong Institute
              </h5>
              <div className="px-1 py-[0.188rem] rounded-sm text-[#0066FF] bg-[#0066FF1F] caption-2">
                LEVEL {data?.data?.languages.sejong_institute}
              </div>
            </div>
            {data?.data?.languages.etc?.map((data: LanguageType) => (
              <div
                key={data.id}
                className="flex justify-between items-center w-full p-4 rounded-lg bg-[#F4F4F9]"
              >
                <h5 className="pb-[0.125rem] button-2 text-[#464646]">
                  {data.language_name}
                </h5>
                <div className="px-1 py-[0.188rem] rounded-sm text-[#0066FF] bg-[#0066FF1F] caption-2">
                  Level {data.level}
                </div>
              </div>
            ))}
          </div>
        </InfoCardLayout>
      </section>
    </>
  );
};

export default PostApplyResume;
