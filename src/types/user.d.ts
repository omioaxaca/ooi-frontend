export interface LoggedUser {
  jwt: string
  refreshToken?: string
  user: User
}

export interface User {
  id: number
  documentId: string
  firstName: string
  lastName: string
  email: string
  roleType: string
  phoneNumber: string
  birthDate: string
  schoolGrade: string
  schoolLevel: string
  schoolName: string
  aboutYou: string
  hobbies: string
  pastExperience: string
  avatar?: {
    id: number;
    documentId: string;
    url: string;
  },
  omegaupUserId: string
  discordUserId: string
}

export interface NewUser {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  birthDate: string
  schoolName: string
  schoolLevel: string
  schoolGrade: string
  omegaupUserId: string
  discordUserId: string
  aboutYou: string
  hobbies: string
  pastExperience: string
}

export interface UpdateUser {
  phoneNumber: string
  birthDate: string
  schoolName: string
  schoolLevel: string
  schoolGrade: string
  omegaupUserId: string
  discordUserId: string
  aboutYou: string
  hobbies: string
  pastExperience: string
}