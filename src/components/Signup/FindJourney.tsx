import Button from '@/components/Common/Button';
import { cardData, UserType } from '@/constants/user';
import BottomButtonPanel from '../Common/BottomButtonPanel';
import PageTitle from '../Common/PageTitle';

type findJourneyProps = {
  onSignUpClick: () => void;
  onTypeSelect: (type: UserType) => void;
  accountType: UserType | null;
};

const FindJourney = ({
  onSignUpClick,
  onTypeSelect,
  accountType,
}: findJourneyProps) => {
  const handleClick = (value: UserType) => {
    onTypeSelect(value);
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <PageTitle
        title={'어떤 역할로\n가입하시겠어요? 🙌'}
        content={'먼저, 어떤 역할로 가입할지 선택해 주세요!'}
      />
      <div className="w-full flex flex-col gap-2.5 pb-6">
        {/* 유학생, 고용주 타입 선택 카드 */}
        {cardData.map((card) => (
          <div
            key={card.accountType}
            className={`w-full py-6 px-[1.125rem] flex flex-col justify-end gap-1.5 rounded-lg ${
              accountType === card.accountType
                ? 'bg-surface-primary text-text-normal border-border-primary border'
                : 'bg-surface-base border-border-alternative border text-text-alternative'
            }`}
            onClick={() => handleClick(card.accountType)}
          >
            <p className="head-3">{card.title}</p>
            <p className="body-3">{card.description}</p>
          </div>
        ))}
      </div>
      <div className="py-6 w-full">
        {/* 타입 선택 후에 Sign Up 가능 */}
        <BottomButtonPanel>
          <Button
            type="large"
            bgColor={accountType ? 'bg-[#1E1926]' : 'bg-[#F4F4F9]'}
            fontColor={accountType ? 'text-[#FEF387]' : 'text-[#BDBDBD]'}
            isBorder={false}
            title="다음으로"
            onClick={accountType ? onSignUpClick : undefined}
          />
        </BottomButtonPanel>
      </div>
    </div>
  );
};

export default FindJourney;
