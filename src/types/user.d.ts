export interface User {
  id: string
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
  pastExperience: string
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