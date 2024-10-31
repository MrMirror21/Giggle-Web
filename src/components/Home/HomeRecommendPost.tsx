import MessageIcon from '@/assets/icons/Home/MessageIcon.svg?react';
import HomeRecommendPostCard from '@/components/Home/HomeRecommendPostCard';
import { useGetRecommendPostList } from '@/hooks/api/usePost';
import { RecommendJobPostingItemType } from '@/types/home/recommendJobPostingItem';
import { useNavigate } from 'react-router-dom';

const HomeRecommendPost = () => {
  const navigate = useNavigate();
  const { data } = useGetRecommendPostList();

  if (!data?.success) return <></>;

  return (
    <section className="w-full flex gap-[0.5rem] px-[1.25rem] pt-[1rem] pb-[1.5rem] overflow-x-scroll no-scrollbar whitespace-nowrap bg-[#FEF387]">
      {data?.data?.job_posting_list?.length ? (
        // 이력서 등록 -> 추천 공고 보여주기
        <>
          {data?.data?.job_posting_list.map(
            (value: RecommendJobPostingItemType) => (
              <HomeRecommendPostCard
                key={`recommend_${value.id}`}
                jobPostingData={value}
              />
            ),
          )}
        </>
      ) : (
        // 이력서 미등록 -> 추가 메뉴 보여주기
        <>
          <article
            className="flex flex-col justify-between min-w-[11.25rem] w-[11.25rem] h-[8.75rem] pt-[0.75rem] pb-[1.125rem] px-[1.125rem] rounded-[1.5rem] border-[0.031rem] border-[#F4F4F9] shadow-cardShadow bg-cover bg-center bg-[url('/src/assets/images/blueGradient.png')]"
            onClick={() => navigate('/profile/manage-resume')}
          >
            <MessageIcon />
            <div>
              <p className="pb-[0.5rem] caption-1 text-[#656565]">
                프로필 채우기
              </p>
              <div className="button-2 text-[#1E1926] break-keep whitespace-normal">
                프로필을 작성하면 추천 공고를 열람할 수 있어요
              </div>
            </div>
          </article>
          <article
            className="flex flex-col justify-between min-w-[11.25rem] w-[11.25rem] h-[8.75rem] pt-[0.75rem] pb-[1.125rem] px-[1.125rem] rounded-[1.5rem] border-[0.031rem] border-[#F4F4F9] shadow-cardShadow bg-cover bg-center bg-[url('/src/assets/images/yellowGradient.png')]"
            onClick={() => navigate('/search')}
          >
            <MessageIcon />
            <div>
              <p className="pb-[0.5rem] caption-1 text-[#656565]">
                공고 찾아보기
              </p>
              <div className="button-2 text-[#1E1926] break-keep whitespace-normal">
                맘에 쏙 드는 공고들을 저장해보세요
              </div>
            </div>
          </article>
        </>
      )}
    </section>
  );
};

export default HomeRecommendPost;
