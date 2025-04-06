export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  profileImage: string
  roleType: string
  phoneNumber: string
  birthDate: string
  schoolGrade: string
  schoolLevel: string
  schoolName: string
  aboutYou: string
  hobbies: string[]
  pastExperience: string,
  avatar: {
    id: number;
    documentId: string;
    url: string;
  }
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
}