import { GenderType, NationalityType, VisaType } from '@/constants/profile';
import {
  EmployerProfileDetailResponse,
  EmployerProfileRequestBody,
  UserEditRequestBody,
  UserProfileDetailResponse,
} from '@/types/api/profile';
import { isValidPhoneNumber } from './information';
import { initialAddress } from '../types/api/users';

// GET 데이터를 PATCH 요청 데이터로 변환
export const changeValidData = (
  userData: UserEditRequestBody,
  phoneNum: { start: string; middle: string; end: string },
  isProfileImgChanged: boolean,
): UserEditRequestBody => {
  return {
    first_name: userData.first_name,
    last_name: userData.last_name,
    birth: userData.birth.replace(/\//g, '-'),
    gender: userData.gender.toUpperCase() as GenderType,
    nationality: userData.nationality
      .toUpperCase()
      .replace(/ /g, '_') as NationalityType,
    visa: userData.visa.replace(/-/g, '_') as VisaType,
    // phone_number 통합
    phone_number: `${phoneNum.start}-${phoneNum.middle}-${phoneNum.end}`,
    is_profile_img_changed: isProfileImgChanged,
    address: userData.address,
  };
};

// GET 데이터를 UI 데이터로 변환
export const transformToProfileRequest = (
  data: UserProfileDetailResponse,
): UserEditRequestBody => {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    birth: data.birth ? data.birth.replace(/-/g, '/') : '',
    gender:
      data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase(),
    nationality: data.nationality
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    visa: data.visa.replace(/_/g, '-'),
    phone_number: data.phone_number,
    is_profile_img_changed: false,
    address: data.address ? data.address : initialAddress,
  };
};

// get 받아온 데이터를 ui 데이터로 수정
export const transformToEmployerProfileRequest = (
  data: EmployerProfileDetailResponse,
): EmployerProfileRequestBody => {
  return {
    owner_info: {
      company_name: data.company_name,
      owner_name: data.owner_name,
      company_registration_number: data.company_registration_number,
      phone_number: data.phone_number,
    },
    address: {
      address_name: data.address.address_name,
      region_1depth_name: data.address.region_1depth_name,
      region_2depth_name: data.address.region_2depth_name,
      region_3depth_name: data.address.region_3depth_name,
      region_4depth_name: data.address.region_4depth_name,
      address_detail: data.address.address_detail,
      longitude: data.address.longitude,
      latitude: data.address.latitude,
    },
    is_icon_img_changed: false,
  };
};

export const validateChanges = (
  originalData: UserEditRequestBody,
  userData: UserEditRequestBody,
  phoneNum: { start: string; middle: string; end: string },
) => {
  const formattedPhoneNumber = `${phoneNum.start}-${phoneNum.middle}-${phoneNum.end}`;

  return Object.entries(userData).some(([key, value]) => {
    const typedKey = key as keyof UserEditRequestBody;
    if (typedKey === 'phone_number') {
      return (
        originalData[typedKey] !== formattedPhoneNumber || // input 필드에서 입력받은 데이터
        originalData[typedKey] !== value // api 수정 요청으로 포맷팅된 데이터
      );
    }
    return value !== originalData[typedKey];
  });
};

export const validateFieldValues = (
  userData: UserEditRequestBody,
  phoneNum: { start: string; middle: string; end: string },
) => {
  return Object.entries(userData).every(([key, value]) => {
    const typedKey = key as keyof UserEditRequestBody;
    const nameRegex = /^[a-zA-Z가-힣\s]+$/;
    switch (typedKey) {
      case 'first_name':
      case 'last_name':
        // 50자 제한, 특수문자 사용 불가, 숫자 사용 불가
        return (
          String(value).trim().length < 50 && nameRegex.test(String(value))
        );
      case 'birth':
        // 생일이 현재 날짜보다 이전인지 확인
        if (value) return Date.parse(value as string) < Date.now();
        return true;
      case 'phone_number':
        return isValidPhoneNumber(phoneNum);
      case 'address':
        // 주소는 필수 입력이 아니므로 체크하지 않으나, 만약 입력되어 있다면 detail이 50자 이하인지 확인
        if (value) {
          const address = value as {
            address_detail: string;
          };
          return address.address_detail.length <= 50;
        }
        return true;
    }
    return true;
  });
};
