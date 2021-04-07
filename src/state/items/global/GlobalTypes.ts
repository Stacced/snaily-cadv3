import { Cad } from "types/Cad";
import { Nullable } from "types/State";

export interface GetCadInfo {
  type: "GET_CAD_INFO";
  cadInfo: Nullable<Cad>;
}

export interface UpdateAop {
  type: "UPDATE_AOP";
  aop: string;
}

export type Actions = GetCadInfo | UpdateAop;
