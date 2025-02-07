import Dropdown, { DropdownModal } from '@/components/Common/Dropdown';
import Input from '@/components/Common/Input';
import InputLayout from '@/components/WorkExperience/InputLayout';
import {
  initialPartTimePermitEmployerForm,
  WorkPeriodInfo,
  WorkPeriodNames,
} from '@/constants/documents';
import {
  EmployerInformation,
  PartTimePermitData,
  WorkPeriod,
} from '@/types/api/document';
import { InputType } from '@/types/common/input';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import SignaturePad from '@/components/Document/write/SignaturePad';
import { extractNumbersAsNumber, getWorkPeriodKeyByName } from '@/utils/post';
import BottomButtonPanel from '@/components/Common/BottomButtonPanel';
import Button from '@/components/Common/Button';
import { usePutPartTimeEmployPermitEmployer } from '@/hooks/api/useDocument';
import { useParams } from 'react-router-dom';
import {
  handleHourlyRateBlur,
  parseStringToSafeNumber,
  validateEmployerInformation,
} from '@/utils/document';
import {
  formatCompanyRegistrationNumber,
  formatPhoneNumber,
  parsePhoneNumber,
} from '@/utils/information';
import { phone } from '@/constants/information';
import LoadingItem from '@/components/Common/LoadingItem';
import { useAddressSearch } from '@/hooks/api/useAddressSearch';

type PartTimePermitFormProps = {
  document?: PartTimePermitData;
  isEdit: boolean;
};

const EmployerPartTimePermitForm = ({
  document,
  isEdit,
}: PartTimePermitFormProps) => {
  const { id } = useParams();
  const [newDocumentData, setNewDocumentData] = useState<EmployerInformation>(
    initialPartTimePermitEmployerForm,
  );
  // 세 부분으로 나누어 입력받는 방식을 위해 전화번호만 별도의 state로 분리, 추후 유효성 검사 단에서 통합
  const [phoneNum, setPhoneNum] = useState({
    start: newDocumentData.phone_number
      ? parsePhoneNumber(newDocumentData.phone_number).start
      : '',
    middle: newDocumentData.phone_number
      ? parsePhoneNumber(newDocumentData.phone_number).middle
      : '',
    end: newDocumentData.phone_number
      ? parsePhoneNumber(newDocumentData.phone_number).end
      : '',
  });
  const {
    addressInput, // 주소 검색용 input 저장하는 state
    addressSearchResult, // 주소 검색 결과를 저장하는 array
    currentGeoInfo, // 지도에 표시할 핀에 사용되는 위/경도 좌표
    setCurrentGeoInfo,
    handleAddressSearch, // 검색할 주소 입력 시 실시간 검색
    handleAddressSelect, // 검색 결과 중 원하는 주소를 선택할 시 state에 입력
    setAddressInput,
  } = useAddressSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  // 입력 완료 시 제출
  const { mutate: putDocument } = usePutPartTimeEmployPermitEmployer(
    Number(id),
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  useEffect(() => {
    if (addressInput !== '') handleAddressSearch(addressInput);
  }, []);

  useEffect(() => {
    if (isEdit && document?.employer_information) {
      setNewDocumentData(document?.employer_information);
      setPhoneNum({
        start: parsePhoneNumber(document?.employee_information.phone_number)
          .start,
        middle: parsePhoneNumber(document?.employee_information.phone_number)
          .middle,
        end: parsePhoneNumber(document?.employee_information.phone_number).end,
      });
      setAddressInput(document.employer_information.address.address_name ?? '');
      setCurrentGeoInfo({
        lat: document.employer_information.address.latitude as number,
        lon: document.employer_information.address.longitude as number,
      });
    }
  }, [document, isEdit]);

  // 휴대번호 데이터 업데이트
  useEffect(() => {
    setNewDocumentData({
      ...newDocumentData,
      phone_number: formatPhoneNumber(phoneNum),
    });
  }, [phoneNum]);

  /* 정보 입력 시마다 유효성을 검사해 모든 값이 유효하면 버튼이 활성화 */
  useEffect(() => {
    setIsInvalid(
      !validateEmployerInformation({
        ...newDocumentData,
        hourly_rate: extractNumbersAsNumber(
          String(newDocumentData.hourly_rate),
        ),
        phone_number: formatPhoneNumber(phoneNum),
      }),
    );
  }, [newDocumentData, phoneNum]);

  // 검색된 주소 선택 시 state에 반영
  const handleAddressSelection = (selectedAddressName: string) => {
    const result = handleAddressSelect(selectedAddressName);
    if (!result) return;

    setNewDocumentData({
      ...newDocumentData,
      address: {
        ...newDocumentData.address,
        ...result.addressData,
      },
    });
    setAddressInput(result.selectedAddressName);
  };

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 overflow-hidden"
          style={{ touchAction: 'none' }}
          onClick={(e) => e.preventDefault()}
        >
          <LoadingItem />
        </div>
      )}
      <div
        className={`w-full p-6 flex flex-col ${isLoading ? 'overflow-hidden pointer-events-none' : ''}`}
      >
        <div className="[&>*:last-child]:mb-40 flex flex-col gap-4">
          {/* 업체명 입력 */}
          <InputLayout title="업체명" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="이름을 작성해주세요"
              value={newDocumentData.company_name}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  company_name: value,
                })
              }
              canDelete={false}
            />
          </InputLayout>
          {/* 사업자등록번호 입력 */}
          <InputLayout title="사업자등록번호" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="X X X / X X / X X X X X"
              value={newDocumentData.company_registration_number}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  company_registration_number:
                    formatCompanyRegistrationNumber(value),
                })
              }
              canDelete={false}
            />
          </InputLayout>
          {/* 업직종 입력 */}
          <InputLayout title="업종" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="업종을 입력해주세요"
              value={newDocumentData.job_type}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  job_type: value,
                })
              }
              canDelete={false}
            />
          </InputLayout>
          <div className="w-full flex flex-col gap-[1.125rem]">
            {/* 주소 검색 입력 input */}
            <InputLayout title="근무지 주소" isEssential>
              <Input
                inputType={InputType.SEARCH}
                placeholder="주소 검색"
                value={addressInput}
                onChange={(value) => handleAddressSearch(value)}
                canDelete={false}
              />
              {/* 주소 검색 결과 보여주는 dropdown modal */}
              {addressSearchResult && addressSearchResult.length !== 0 && (
                <DropdownModal
                  value={newDocumentData.address.address_name}
                  options={Array.from(
                    addressSearchResult.map((address) => address.address_name),
                  )}
                  onSelect={handleAddressSelection}
                />
              )}
            </InputLayout>
            {/* 검색한 위치를 보여주는 지도 */}
            <div className="w-full rounded-xl">
              <Map
                center={{ lat: currentGeoInfo.lat, lng: currentGeoInfo.lon }}
                style={{ width: '100%', height: '200px' }}
                className="rounded-xl"
              >
                <MapMarker
                  position={{
                    lat: currentGeoInfo.lat,
                    lng: currentGeoInfo.lon,
                  }}
                ></MapMarker>
              </Map>
            </div>
            <InputLayout title="상세주소" isEssential={false}>
              <Input
                inputType={InputType.TEXT}
                placeholder="ex) 101동"
                value={newDocumentData.address.address_detail}
                onChange={(value) =>
                  setNewDocumentData({
                    ...newDocumentData,
                    address: {
                      ...newDocumentData.address,
                      address_detail: value,
                    },
                  })
                }
                canDelete={false}
              />
            </InputLayout>
          </div>
          {/* 대표자 이름 입력 */}
          <InputLayout title="대표자 이름" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="이름을 작성해주세요"
              value={newDocumentData.name}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  name: value,
                })
              }
              canDelete={false}
            />
          </InputLayout>
          {/* 담당자 휴대폰 번호 입력 */}
          <InputLayout title="담당자 전화번호" isEssential>
            <div className="w-full flex flex-row gap-2 justify-between">
              <div className="w-full h-[2.75rem]">
                <Dropdown
                  value={phoneNum.start}
                  placeholder="+82"
                  options={phone}
                  setValue={(value) =>
                    setPhoneNum({ ...phoneNum, start: value })
                  }
                />
              </div>
              <Input
                inputType={InputType.TEXT}
                placeholder="0000"
                value={phoneNum.middle}
                onChange={(value) =>
                  setPhoneNum({ ...phoneNum, middle: value })
                }
                canDelete={false}
              />
              <Input
                inputType={InputType.TEXT}
                placeholder="0000"
                value={phoneNum.end}
                onChange={(value) => setPhoneNum({ ...phoneNum, end: value })}
                canDelete={false}
              />
            </div>
          </InputLayout>
          {/* 서명 입력 */}
          <InputLayout title="서명" isEssential>
            <SignaturePad
              onSave={(signature: string) =>
                setNewDocumentData({
                  ...newDocumentData,
                  signature_base64: signature,
                })
              }
              onReset={() =>
                setNewDocumentData({
                  ...newDocumentData,
                  signature_base64: '',
                })
              }
              isKorean
              previewImg={newDocumentData.signature_base64}
            />
          </InputLayout>
          {/* 근무 기간 입력 */}
          <InputLayout title="근무기간" isEssential>
            <Dropdown
              value={
                newDocumentData.work_period === null
                  ? ''
                  : WorkPeriodInfo[newDocumentData.work_period as WorkPeriod]
                      .name
              }
              placeholder="근무 기간을 선택해주세요"
              options={WorkPeriodNames}
              setValue={(value) => {
                setNewDocumentData({
                  ...newDocumentData,
                  work_period: getWorkPeriodKeyByName(value as string),
                });
              }}
            />
          </InputLayout>
          {/* 시급 입력 */}
          <InputLayout title="시급" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="시급을 입력해주세요"
              value={String(newDocumentData.hourly_rate)}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  hourly_rate: parseStringToSafeNumber(value),
                })
              }
              onBlur={() =>
                handleHourlyRateBlur(String(newDocumentData.hourly_rate))
              }
              canDelete={false}
              isUnit
              unit="원"
            />
            <div className="w-full relative body-3 px-1 py-1.5 text-[#222] text-left">
              2025년 기준 최저시급은 10,030원입니다.
            </div>
          </InputLayout>
          {/* 근무 시간(평일) 입력 */}
          <InputLayout title="근무 시간(평일)" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="ex) 요일/00:00-00:00 혹은 휴무"
              value={newDocumentData.work_days_weekdays}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  work_days_weekdays: value,
                })
              }
              canDelete={false}
            />
          </InputLayout>
          {/* 근무 시간(주말) 입력 */}
          <InputLayout title="근무시간(주말)" isEssential>
            <Input
              inputType={InputType.TEXT}
              placeholder="ex) 요일/00:00-00:00 혹은 휴무"
              value={newDocumentData.work_days_weekends}
              onChange={(value) =>
                setNewDocumentData({
                  ...newDocumentData,
                  work_days_weekends: value,
                })
              }
              canDelete={false}
            />
          </InputLayout>
        </div>
        <BottomButtonPanel>
          {/* 정보 입력 시마다 유효성을 검사해 모든 값이 유효하면 버튼이 활성화 */}
          <Button
            type="large"
            bgColor={isInvalid ? 'bg-[#F4F4F9]' : 'bg-[#fef387]'}
            fontColor={isInvalid ? '' : 'text-[#222]'}
            isBorder={false}
            title="완료"
            onClick={
              isInvalid
                ? undefined
                : () =>
                    putDocument({
                      id: Number(id),
                      document: {
                        ...newDocumentData,
                        work_days_weekdays: newDocumentData.work_days_weekdays,
                        work_days_weekends: newDocumentData.work_days_weekends,
                      },
                    })
            }
          />
        </BottomButtonPanel>
      </div>
    </>
  );
};

export default EmployerPartTimePermitForm;
