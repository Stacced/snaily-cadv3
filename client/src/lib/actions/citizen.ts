import Citizen from "../../interfaces/Citizen";
import Logger from "../Logger";
import {
  CREATE_CITIZEN,
  CREATE_CITIZEN_ERROR,
  GET_CITIZENS,
  GET_CITIZEN_BY_ID,
  GET_REGISTERED_WEAPONS,
  DELETE_REGISTERED_WEAPON,
  REGISTER_WEAPON,
  REGISTER_WEAPON_ERROR,
  GET_REGISTERED_VEHICLES,
  DELETE_REGISTERED_VEHICLE,
  REGISTER_VEHICLE,
  REGISTER_VEHICLE_ERROR,
  GET_MEDICAL_RECORDS,
  CREATE_MEDICAL_RECORD,
  CREATE_MEDICAL_RECORD_ERROR,
  DELETE_MEDICAL_RECORD,
  DELETE_CITIZEN,
  UPDATE_LICENSES,
  GET_VEHICLE_BY_ID,
  UPDATE_VEHICLE,
} from "../types";
import { Dispatch } from "react";
import { handleRequest, isSuccess } from "../functions";
import Weapon from "../../interfaces/Weapon";
import Vehicle from "../../interfaces/Vehicle";
import MedicalRecord from "../../interfaces/MedicalRecord";

interface IDispatch {
  type: string;
  error?: string;
  citizen?: Citizen;
  citizens?: Citizen[];
  weapons?: Weapon[];
  vehicles?: Vehicle[];
  vehicle?: Vehicle;
  medicalRecords?: MedicalRecord[];
}

export const getCitizens = () => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest("/citizen", "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CITIZENS,
        citizens: res.data.citizens,
      });
    }
  } catch (e) {
    Logger.error(GET_CITIZENS, e);
  }
};

export const getCitizenById = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_CITIZEN_BY_ID,
        citizen: res.data.citizen,
      });
    }
  } catch (e) {
    Logger.error(GET_CITIZEN_BY_ID, e);
  }
};

export const createCitizen = (data: Citizen) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const {
      image,
      full_name,
      gender,
      ethnicity,
      birth,
      hair_color,
      eye_color,
      address,
      height,
      weight,
      dmv,
      pilot_license,
      fire_license,
      ccw,
    } = data;

    const fd = new FormData();
    fd.append("image", image, image?.name);
    fd.append("full_name", full_name);
    fd.append("gender", gender);
    fd.append("ethnicity", ethnicity);
    fd.append("birth", birth);
    fd.append("hair_color", hair_color);
    fd.append("eye_color", eye_color);
    fd.append("address", address);
    fd.append("height", height);
    fd.append("weight", weight);
    fd.append("dmv", dmv);
    fd.append("pilot_license", pilot_license);
    fd.append("fire_license", fire_license);
    fd.append("ccw", ccw);

    const res = await handleRequest("/citizen", "POST", fd);

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_CITIZEN,
      });
      return (window.location.href = `/citizen/${res.data.citizenId}`);
    } else {
      dispatch({
        type: CREATE_CITIZEN_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_CITIZEN, e);
  }
};

export const deleteCitizen = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/${id}`, "DELETE");

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_CITIZEN,
      });
      return (window.location.href = "/citizen");
    }
  } catch (e) {
    Logger.error(DELETE_CITIZEN, e);
  }
};

export const getMedicalRecords = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/medical-records/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_MEDICAL_RECORDS,
        medicalRecords: res.data.medicalRecords,
      });
    }
  } catch (e) {
    Logger.error(GET_MEDICAL_RECORDS, e);
  }
};

export const createMedicalRecord = (data: object, citizenId: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(
      `/citizen/medical-records/${citizenId}`,
      "POST",
      data
    );

    if (isSuccess(res)) {
      dispatch({
        type: CREATE_MEDICAL_RECORD,
      });

      return (window.location.href = `/citizen/${citizenId}`);
    } else {
      dispatch({
        type: CREATE_MEDICAL_RECORD_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(CREATE_MEDICAL_RECORD, e);
  }
};

export const deleteMedicalRecord = (
  citizenId: string,
  recordId: string
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(
      `/citizen/medical-records/${citizenId}/${recordId}`,
      "DELETE"
    );

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_MEDICAL_RECORD,
        medicalRecords: res.data.medicalRecords,
      });
    }
  } catch (e) {
    Logger.error(DELETE_MEDICAL_RECORD, e);
  }
};
export const getRegisteredVehicles = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_REGISTERED_VEHICLES,
        vehicles: res.data.vehicles,
      });
    }
  } catch (e) {
    Logger.error(GET_REGISTERED_VEHICLES, e);
  }
};

export const registerVehicle = (data: object) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles`, "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: REGISTER_VEHICLE,
      });
      return (window.location.href = `/citizen/${res.data.citizenId}`);
    } else {
      dispatch({
        type: REGISTER_VEHICLE_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(REGISTER_VEHICLE, e);
  }
};

export const reportAsStolen = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {};

export const deleteVehicle = (citizenId: string, vehicleId: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(
      `/citizen/vehicles/${citizenId}/${vehicleId}`,
      "DELETE"
    );

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_REGISTERED_VEHICLE,
        vehicles: res.data.vehicles,
      });
    }
  } catch (e) {
    Logger.error(DELETE_REGISTERED_VEHICLE, e);
  }
};

export const getRegisteredWeapons = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/weapons/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_REGISTERED_WEAPONS,
        weapons: res.data.weapons,
      });
    }
  } catch (e) {
    Logger.error(GET_REGISTERED_WEAPONS, e);
  }
};

export const registerWeapon = (data: object) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest("/citizen/weapons", "POST", data);

    if (isSuccess(res)) {
      dispatch({
        type: REGISTER_WEAPON,
      });
      return (window.location.href = `/citizen/${res.data.citizenId}`);
    } else {
      dispatch({
        type: REGISTER_WEAPON_ERROR,
        error: res.data.error,
      });
    }
  } catch (e) {
    Logger.error(REGISTER_WEAPON, e);
  }
};

export const deleteWeapon = (citizenId: string, weaponId: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(
      `/citizen/weapons/${citizenId}/${weaponId}`,
      "DELETE"
    );

    if (isSuccess(res)) {
      dispatch({
        type: DELETE_REGISTERED_WEAPON,
        weapons: res.data.weapons,
      });
    }
  } catch (e) {
    Logger.error(DELETE_REGISTERED_WEAPON, e);
  }
};

export const updateLicenses = (id: string, data: object) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/licenses/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_LICENSES,
      });

      return (window.location.href = `/citizen/${id}`);
    }
  } catch (e) {
    Logger.error(UPDATE_LICENSES, e);
  }
};

export const getVehicleById = (id: string) => async (
  dispatch: Dispatch<IDispatch>
) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/i/${id}`, "GET");

    if (isSuccess(res)) {
      dispatch({
        type: GET_VEHICLE_BY_ID,
        vehicle: res.data.vehicle,
      });
    }
  } catch (e) {
    Logger.error(GET_VEHICLE_BY_ID, e);
  }
};

export const updateVehicleById = (
  id: string,
  citizenId: string,
  data: object
) => async (dispatch: Dispatch<IDispatch>) => {
  try {
    const res = await handleRequest(`/citizen/vehicles/${id}`, "PUT", data);

    if (isSuccess(res)) {
      dispatch({
        type: UPDATE_VEHICLE,
      });

      return (window.location.href = `/citizen/${citizenId}`);
    }
  } catch (e) {
    Logger.error(UPDATE_VEHICLE, e);
  }
};
