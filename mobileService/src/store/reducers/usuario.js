import { FAZER_LOGOUT, FAZER_LOGIN, GUARDAR_STATE } from "~store/actionTypes";

const initialState = {
  profissional: "",
  nome: "",
  email: "",
  tipo: "",
  logged: false,
  id: "",
  realmId: "",
  realmEmail: "",
};

/**
 *
 * @param {{profissional:string,nome:string,email:string,tipo:string,logged:boolean,id:string,realmId:string,realmEmail:string}} state Dados atuais do usuario
 * @param {{type:string, payload:{ID:string, NOME:string,EMAIL:string,PROFISSIONAL:boolean,TIPO:string,error:boolean,REALM_ID:string,REALM_EMAIL:string}}} action Tipo de ação a ser executada, e dados a serem aplicados
 * @returns Faz alteração de estados no User ou retorna atual estado do User
 */
const user = (state = initialState, action) => {
  switch (action.type) {
    case FAZER_LOGIN:
      return {
        ...state,
        id: action.payload.ID,
        nome: action.payload.NOME,
        email: action.payload.EMAIL,
        profissional: action.payload.PROFISSIONAL,
        tipo: action.payload.TIPO,
        logged: !action.payload.error,
        realmId: action.payload.REALM_ID,
        realmEmail: action.payload.REALM_EMAIL,
      };
    case FAZER_LOGOUT:
      return {
        ...initialState,
      };
    case GUARDAR_STATE:
      return {
        ...state,
        tipo: action.payload.TIPO,
      };
    default:
      return state;
  }
};

export default user;
