import BaseHeader from '@/components/Common/Header/BaseHeader';
import RadioButton from '@/components/Information/RadioButton';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buttonTypeKeys } from '@/constants/components';
import Button from '@/components/Common/Button';
import { usePatchHiKoreaResult } from '@/hooks/api/useApplication';
import BottomButtonPanel from '@/components/Common/BottomButtonPanel';
import PageTitle from '@/components/Common/PageTitle';

const ApplicationResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutate } = usePatchHiKoreaResult(Number(id));

  const [isApproval, setIsApproval] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('');

  const onClickRegistration = () => {
    if (isNaN(Number(id))) return;
    const body = {
      is_approval: isApproval,
      feedback: feedback,
    };
    mutate({ id: Number(id), body: body });
  };

  return (
    <>
      <BaseHeader
        hasBackButton={true}
        title="Register the result"
        onClickBackButton={() => navigate(`/application/${id}`)}
        hasMenuButton={false}
      />
      <PageTitle
        title={`How did it go? \nLet’s wrap this up! 📋`}
        content={`Select your HiKorea application result \nand share your experience`}
      />
      <main className="flex flex-col gap-4 w-full px-4">
        <section>
          <h3 className="px-1 py-[0.375rem] button-2 text-primary-dark">
            HiKorea e-Government
            <span className="pl-1 body-1 text-text-error">*</span>
          </h3>
          <div className="px-1 py-[0.375rem] flex flex-col gap-4">
            <RadioButton
              value={'Approved! 🎉'}
              setValue={() => setIsApproval(true)}
              isOn={isApproval === true}
            />
            <RadioButton
              value={'Not approved 😞'}
              setValue={() => setIsApproval(false)}
              isOn={isApproval === false}
            />
          </div>
        </section>
        <section className="w-full">
          <h3 className="px-1 py-[0.375rem] button-2 text-primary-dark">
            Share your experience
          </h3>
          <textarea
            className="min-h-24 w-full px-4 py-3 border border-border-alternative rounded body-2 focus:outline-none resize-none"
            placeholder="Was the process smooth? Any challenges? 💬"
            maxLength={200}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </section>
      </main>
      <BottomButtonPanel>
        <Button
          type={buttonTypeKeys.LARGE}
          bgColor={'bg-primary-normal'}
          fontColor="text-surface-invert"
          title="Submit result"
          isBorder={false}
          onClick={onClickRegistration}
        />
      </BottomButtonPanel>
    </>
  );
};

export default ApplicationResultPage;
