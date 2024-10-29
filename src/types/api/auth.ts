import { UserType } from '@/constants/user';
import { Address, Language, UserInfo } from '@/types/api/users';

export type SignInRequest = {
  serial_id: string;
  password: string;
};

export type SignInResponse = {
  access_token: string;
  refresh_token: string;
};

export type UserTypeResponse = {
  account_type: UserType;
  name: string;
};

export type TempSignUpRequest = {
  id: string;
  password: string;
  email: string;
  account_type: string;
};

export type TempSignUpResponse = {
  try_cnt: number;
};

export type SignUpRequest = {
  temporary_token: string;
  user_info: UserInfo;
  address: Address;
  marketing_allowed: boolean;
  notification_allowed: boolean;
  language: Language;
};
/*
export type OwnerSignUpRequest = {
  temporary_token: String;
  owner_info: OwnerInfoRequest;
  address: Address;
  marketing_allowed: Boolean;
  notification_allowed: Boolean;
};
*/

export type SignUpResponse = {
  access_token: string;
  refresh_token: string;
};

export type ValidationResponse = {
  is_valid: boolean;
};

export type AuthenticationRequest = {
  id: string;
  email: string;
  authentication_code: string;
};

export type AuthenticationResponse = {
  temporary_token: string;
};

export type ReIssueAuthenticationRequest = {
  id: string;
  email: string;
};
