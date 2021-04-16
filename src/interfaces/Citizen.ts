import { Perm } from "./Perm";

export interface Citizen {
  image: any;
  id: string;
  user_id: string;
  full_name: string;
  birth: string;
  gender: string;
  ethnicity: string;
  hair_color: string;
  eye_color: string;
  address: string;
  height: string;
  weight: string;
  dmv: string;
  fire_license: string;
  pilot_license: string;
  ccw: string;
  business: string;
  business_id: string;
  rank: "owner" | "manager" | "employee" | "";
  vehicle_reg: Perm;
  posts: Perm;
  image_id: string;
  b_status: string;
  note: string;
  phone_nr: string;
  dead: Perm;
  dead_on: string;

  user?: {
    username: string;
  };
}