export interface Profile {
  id: number,
  username: string,
  email: string,
  name: string,
  surname1: string,
  surname2: string,
  birthdate: string,
  language: string,
  currency: string
}

export const DEFAULT_PROFILE = {
  id: 0,
  username: "",
  email: "",
  name: "",
  surname1: "",
  surname2: "",
  birthdate: "",
  language: "ENG",
  currency: "EUR",
};