import { FAZER_LOGIN, FAZER_LOGOUT, GUARDAR_STATE } from "~store/actionTypes";

/**
 * User data setter
 * @param {{PROFISSIONAL: boolean,NOME: string, EMAIL:string,TIPO:string,error:boolean,ID: string,REALM_ID:string,REALM_EMAIL:string}} Data Dados do usuario
 * @returns Setter com Payload e Tipo de conta
 */
export const setUser = ({
  PROFISSIONAL = false,
  NOME,
  EMAIL,
  TIPO,
  error,
  ID,
  REALM_ID,
  REALM_EMAIL,
}) => ({
  type: FAZER_LOGIN,
  payload: {
    PROFISSIONAL,
    NOME,
    EMAIL,
    TIPO,
    ID,
    error,
    REALM_ID,
    REALM_EMAIL,
  },
});

/**
 * Setter para definir qual tipo de conta foi logada
 * @param {{TIPO: string}} TIPO "clie" || "prof"
 * @returns Tipo de Action para settar User
 */
export const setRole = ({ TIPO }) => ({
  type: GUARDAR_STATE,
  payload: { TIPO },
});

/**
 * @returns Tipo de Action para o Logout
 */
export const fazerLogout = () => {
  return {
    type: FAZER_LOGOUT,
  };
};
