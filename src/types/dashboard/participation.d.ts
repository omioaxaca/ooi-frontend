import type { ContestCycle } from "./contestCycle";
import type { User } from "../user";

export type NationalMedal =
  | "GOLD"
  | "SILVER"
  | "BRONZE"
  | "HONORIFICMENTION"
  | "PARTICIPATION";

export type Participation = {
  id: number;
  documentId: string;
  signupDate: string;
  diagnosticExamDone: boolean;
  isStateWinner: boolean;
  stateWinnerPlace: number | null;
  nationalWinnerPlace: number | null;
  nationalMedalWon: NationalMedal | null;
  isStateFinalist: boolean;
  contestCycle: ContestCycle;
  user: User;
  createdAt: string;
  updatedAt: string;
};

export type CreateParticipationData = {
  contestCycle: number; // The ID of the contest cycle
  user: number; // The ID of the user
  signupDate: string;
  diagnosticExamDone?: boolean;
  isStateWinner?: boolean;
  stateWinnerPlace?: number | null;
  nationalWinnerPlace?: number | null;
  nationalMedalWon?: NationalMedal | null;
  isStateFinalist?: boolean;
};

export type ParticipationListItem = {
  id: number;
  documentId: string;
  signupDate: string;
  diagnosticExamDone: boolean;
  isStateWinner: boolean;
  stateWinnerPlace: number | null;
  nationalWinnerPlace: number | null;
  nationalMedalWon: NationalMedal | null;
  isStateFinalist: boolean;
  contestCycle: ContestCycle;
  createdAt: string;
  updatedAt: string;
};
