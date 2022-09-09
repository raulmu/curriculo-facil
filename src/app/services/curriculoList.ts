import { Curriculo } from "./curriculo";

export interface CurriculoList {
  uid: string;
  ownerUID: string;
  curriculos: Curriculo | any;
}
