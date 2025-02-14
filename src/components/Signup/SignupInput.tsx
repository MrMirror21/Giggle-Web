import { useEffect, useState } from 'react';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import { useLocation } from 'react-router-dom';
import {
  validatedConfirmPassword,
  validateEmail,
  validatePassword,
} from '@/utils/signin';
import { isEmployer } from '@/utils/signup';
import { signInputTranclation } from '@/constants/translation';
import {
  useGetEmailValidation,
  usePatchAuthentication,
  useReIssueAuthentication,
} from '@/hooks/api/useAuth';
import BottomButtonPanel from '../Common/BottomButtonPanel';
import InputLayout from '../WorkExperience/InputLayout';
import { useEmailTryCountStore } from '@/store/signup';

type signupInputProps = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  authenticationCode: string;
  onAuthCodeChange: (value: string) => void;
  onSignUpClick: () => void;
};

const SignupInput = ({
  onSignUpClick,
  email,
  password,
  authenticationCode,
  onEmailChange,
  onPasswordChange,
  onAuthCodeChange,
}: signupInputProps) => {
  const { pathname } = useLocation();
  const [emailVerifyStatus, setEmailVerifyStatus] = useState<string | null>(
    null,
  );
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const { try_cnt } = useEmailTryCountStore();
  const [passwordError, setPasswordError] = useState<string | null>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [isValid, setIsValid] = useState(false);

  const { data: ValidationResponse } = useGetEmailValidation(email);

  // 이메일 재발송 훅
  const { mutate: reIssueAuthentication } = useReIssueAuthentication();
  // 인증코드 검증 훅
  const { mutate: verifyAuthCode } = usePatchAuthentication();

  // 이메일 입력 시, 인증번호 발송 초기화
  const handleEmailInput = (value: string) => {
    if (emailVerifyStatus === 'verified') return;
    onEmailChange(value);
    setEmailVerifyStatus(null);
  };

  // ID 검사
  useEffect(() => {
    const validateEmailAsync = async () => {
      if (!email) return; // 이메일이 없을 경우 바로 반환

      onEmailChange(email);

      // 이메일 형식 유효성 검사
      if (!validateEmail(email, setEmailError, pathname)) {
        setIsValid(false); // 유효성 검사 실패 시 버튼 비활성화
        return;
      }

      // 이메일 중복 검사 API 호출 결과 처리
      if (ValidationResponse && ValidationResponse.data.is_valid === false) {
        setEmailError(
          signInputTranclation.emailAvailability[isEmployer(pathname)],
        );
        setIsValid(false); // 중복 검사 실패 시 버튼 비활성화
      } else if (ValidationResponse && ValidationResponse.data.is_valid) {
        setEmailError(null); // email 중복 오류 메시지 초기화
        setIsValid(true); // 중복 검사 통과 시 버튼 활성화
      } else {
        setIsValid(false); // 예외처리
      }
    };

    validateEmailAsync();
  }, [email, pathname, ValidationResponse, onEmailChange]);

  // password 유효성 검사
  useEffect(() => {
    if (password) {
      onPasswordChange(password);
      validatePassword(password, setPasswordError, pathname);
    }
  }, [password, pathname, onPasswordChange]);

  // password 일치 유효성 검사
  useEffect(() => {
    if (confirmPasswordValue) {
      validatedConfirmPassword(
        password,
        confirmPasswordValue,
        setConfirmPasswordError,
        pathname,
      );
    }
  }, [password, confirmPasswordValue, pathname]);

  // 모든 필드의 유효성 검사 후, Continue 버튼 활성화
  useEffect(() => {
    if (
      validateEmail(email, setEmailError, pathname) &&
      validatePassword(password, setPasswordError, pathname) &&
      confirmPasswordValue == password
    ) {
      setIsValid(true);
    }
  }, [email, password, confirmPasswordValue]);

  // API - 2.7 이메일 인증코드 검증
  const handleVerifyClick = () => {
    verifyAuthCode(
      //TODO: id가 이메일 형태로 받게되면 id를 email로 변경
      { id: 'goorm', email: email, authentication_code: authenticationCode },
      {
        onSuccess: () => setEmailVerifyStatus('verified'),
        onError: () => {
          setEmailVerifyStatus('error');
          setEmailError(
            `${signInputTranclation.verifyFailed[isEmployer(pathname)]} (${try_cnt}/5)`,
          );
        },
      },
    );
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPasswordValue(value);
  };

  // 이메일 인증코드 재전송 API 호출
  const handleResendClick = async () => {
    if (email === '') {
      return;
    }

    try {
      // 5회 이내 재발송 가능
      reIssueAuthentication(
        { id: email, email: email },
        {
          onSuccess: () => {
            onAuthCodeChange('');
            setIsValid(false);
            const status = try_cnt > 1 ? 'resent' : 'sent';
            setEmailVerifyStatus(status);
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[230px] title-1 pb-12">
        {signInputTranclation.signup[isEmployer(pathname)]}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <InputLayout
            isEssential
            title={signInputTranclation.email[isEmployer(pathname)]}
          >
            <div className="flex gap-2">
              <Input
                inputType="TEXT"
                placeholder={
                  signInputTranclation.enterEmail[isEmployer(pathname)]
                }
                value={email}
                onChange={handleEmailInput}
                canDelete={false}
                isInvalid={!isValid}
              />
              <button
                className={`flex items-center justify-center button-2 min-w-[4.25rem] px-5 py-3 rounded-md ${
                  emailVerifyStatus === null
                    ? 'bg-surface-primary text-text-normal'
                    : 'bg-surface-secondary text-text-disabled'
                }`}
                onClick={handleResendClick}
              >
                {emailVerifyStatus === null
                  ? signInputTranclation.sendEmail[isEmployer(pathname)]
                  : signInputTranclation.emailSentBtnText[isEmployer(pathname)]}
              </button>
            </div>
            {/* 인증번호 전송 후 인증번호 입력 input 출현 */}
            {emailVerifyStatus !== null && (
              <div className="flex gap-2 h-full pt-2">
                <div className="relative w-full">
                  <Input
                    inputType="TEXT"
                    placeholder={
                      signInputTranclation.verification[isEmployer(pathname)]
                    }
                    value={authenticationCode}
                    onChange={onAuthCodeChange}
                    canDelete={false}
                  />
                  {emailVerifyStatus !== 'verified' && (
                    <button
                      className="caption-1 text-blue-500 underline absolute right-[1rem] top-[1rem]"
                      onClick={handleResendClick} // 이메일 인증코드 재전송 API 호출
                    >
                      {signInputTranclation.resend[isEmployer(pathname)]}
                    </button>
                  )}
                </div>
                <button
                  className={`flex items-center justify-center min-w-[5.5rem] button-2 px-5 py-3 rounded-md ${
                    emailVerifyStatus === 'verified'
                      ? 'bg-surface-secondary text-text-disabled'
                      : 'bg-surface-primary text-text-normal'
                  }`}
                  onClick={
                    emailVerifyStatus === 'verified'
                      ? undefined
                      : handleVerifyClick
                  }
                >
                  {signInputTranclation.verify[isEmployer(pathname)]}
                </button>
              </div>
            )}
            {emailVerifyStatus === 'sent' && (
              <p className="text-blue-600 text-xs p-2">
                {signInputTranclation.enterCode[isEmployer(pathname)]}
              </p>
            )}
            {emailVerifyStatus === 'resent' && (
              <p className="text-blue-600 text-xs p-2">
                {signInputTranclation.resentMessage[isEmployer(pathname)]}
              </p>
            )}
            {emailVerifyStatus === 'verified' && (
              <p className="text-blue-600 text-xs p-2">
                {signInputTranclation.successVerify[isEmployer(pathname)]}
              </p>
            )}
            {emailError && (
              <p className="text-[#FF6F61] text-xs p-2">{emailError}</p>
            )}
            {/* 비밀번호 입력 input */}
          </InputLayout>
          <InputLayout
            isEssential
            title={signInputTranclation.password[isEmployer(pathname)]}
          >
            <Input
              inputType="PASSWORD"
              placeholder={
                signInputTranclation.enterPassword[isEmployer(pathname)]
              }
              value={password}
              onChange={onPasswordChange}
              canDelete={false}
              isInvalid={passwordError ? true : false}
            />
            {passwordError && (
              <p className="text-[#FF6F61] text-xs p-2">{passwordError}</p>
            )}
          </InputLayout>
          <InputLayout
            isEssential
            title={signInputTranclation.confirmPassword[isEmployer(pathname)]}
          >
            <Input
              inputType="PASSWORD"
              placeholder={
                signInputTranclation.enterConfirmPassword[isEmployer(pathname)]
              }
              value={confirmPasswordValue}
              onChange={handleConfirmPasswordChange}
              canDelete={false}
              isInvalid={confirmPasswordError ? true : false}
            />
            {confirmPasswordError && (
              <p className="text-[#FF6F61] text-xs p-2">
                {confirmPasswordError}
              </p>
            )}
          </InputLayout>
        </div>
        <BottomButtonPanel>
          <div className="w-full">
            <Button
              type="large"
              bgColor={isValid ? 'bg-[#1E1926]' : 'bg-[#F4F4F9]'}
              fontColor={isValid ? 'text-[#FEF387]' : 'text-[#BDBDBD]'}
              isBorder={false}
              title={signInputTranclation.signupTitle[isEmployer(pathname)]}
              onClick={isValid ? onSignUpClick : undefined}
            />
          </div>
        </BottomButtonPanel>
      </div>
    </div>
  );
};

export default SignupInput;
