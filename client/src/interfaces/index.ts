export type SingupFormdataType = {
  email: string;
  password: string;
  name: string;
};

export const initialSignupFormdata: SingupFormdataType = {
  email: "",
  password: "",
  name: "",
};

export type LoginFormdataType = {
  email: string;
  password: string;
};

export const initialLoginFormdata: LoginFormdataType = {
  email: "",
  password: "",
};
