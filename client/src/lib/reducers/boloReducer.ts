import Bolo from "../../interfaces/Bolo";
import State from "../../interfaces/State";
import { CREATE_BOLO, DELETE_BOLO, GET_BOLOS } from "../types";

const initState: State["bolos"] = {
  bolos: [],
  error: null,
};

type Actions = {
  type: typeof GET_BOLOS | typeof CREATE_BOLO | typeof DELETE_BOLO;
  bolos: Bolo[];
};

export default function boloReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "CREATE_BOLO":
    case "DELETE_BOLO":
    case "GET_BOLOS":
      return {
        ...state,
        bolos: action.bolos,
      };
    default:
      return {
        ...state,
      };
  }
}
