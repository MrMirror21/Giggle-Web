import TextFieldHeader from '@/components/Common/Header/TextFieldHeader';
import PostSearchFilterList from '@/components/PostSearch/PostSearchFilterList';
import PostSearchResult from '@/components/PostSearch/PostSearchResult';

const PostSearchPage = () => {
  // TODO: 여기서 검색어, 검색 필터 모두 전역변수로 관리하기
  return (
    <>
      <TextFieldHeader
        onClickBackButton={() => console.log('?')}
        onClickSearchButton={(value) => console.log(value)}
        placeholder="Search for job posting name"
      />
      <PostSearchFilterList />
      <PostSearchResult />
    </>
  );
};

export default PostSearchPage;
