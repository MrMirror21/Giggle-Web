import BottomSheetLayout from '@/components/Common/BottomSheetLayout';
import Button from '@/components/Common/Button';
import Tag from '@/components/Common/Tag';
import { buttonTypeKeys } from '@/constants/components';
import { postSearchTranslation } from '@/constants/translation';
import { useUserStore } from '@/store/user';
import { isEmployerByAccountType } from '@/utils/signup';

type PostSearchFilterBottomSheetType = {
  currentRegion1: string[];
  currentRegion2: string[];
  currentRegion3: string[];
  onClickDelete: (index: number) => void;
  onClickReset: () => void;
  onClickSubmit: () => void;
};

const PostSearchFilterBottomSheet = ({
  currentRegion1,
  currentRegion2,
  currentRegion3,
  onClickDelete,
  onClickReset,
  onClickSubmit,
}: PostSearchFilterBottomSheetType) => {
  const formatRegionArrayToString = (index: number) => {
    return `${currentRegion1[index]} ${currentRegion2[index]} ${currentRegion3[index] === 'none' ? '' : currentRegion3[index]}`;
  };
  const { account_type } = useUserStore();

  return (
    <BottomSheetLayout
      hasHandlebar={false}
      isAvailableHidden={false}
      isShowBottomsheet={true}
      isFixedBackground={false}
    >
      <div className="w-full flex flex-col gap-6">
        <h3 className="w-full head-3 text-text-normal">
          {
            postSearchTranslation.selectedAreas[
              isEmployerByAccountType(account_type)
            ]
          }
          <span className="pl-2 text-primary-normal">
            {currentRegion1.length}
          </span>
        </h3>
        <div className="w-full flex flex-wrap gap-2">
          {currentRegion1.map((region, index) => (
            <Tag
              key={`${region}_${index}`}
              value={formatRegionArrayToString(index)}
              padding="py-[0.375rem] pr-[0.5rem] pl-[0.675rem]"
              isRounded={true}
              hasCheckIcon={false}
              borderColor={'border-border-alternative'}
              backgroundColor={'bg-surface-base'}
              color="text-text-normal"
              fontStyle="body-2"
              onDelete={() => onClickDelete(index)}
            />
          ))}
        </div>
        <div className="w-full flex justify-center items-center gap-2">
          <Button
            type={buttonTypeKeys.BACK}
            bgColor="bg-surface-secondary"
            fontColor="text-text-normal button-1"
            title={
              postSearchTranslation.reset[isEmployerByAccountType(account_type)]
            }
            isBorder={false}
            onClick={onClickReset}
          />
          <Button
            type={buttonTypeKeys.CONTINUE}
            bgColor="bg-surface-primary"
            fontColor="text-text-normal button-1"
            title={
              postSearchTranslation.apply[isEmployerByAccountType(account_type)]
            }
            isBorder={false}
            onClick={onClickSubmit}
          />
        </div>
      </div>
    </BottomSheetLayout>
  );
};

export default PostSearchFilterBottomSheet;
