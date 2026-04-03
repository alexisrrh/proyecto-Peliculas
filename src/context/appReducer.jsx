export const initialState = {
  Populares: [],
  Favoritos: [],
  Accion: [],
  Comedia:[],
  Terror:[],
  Animadas:[], 


};

export const appReducer = (state, action) => {
  switch (action.type) {
    case "set_favoritos":
      return {
        ...state,
        favoritos: action.payload,
      };

    case "set_Populares":
      return {
        ...state,
        Populares: action.payload,
      };

    case "set_Accion":
      return {
        ...state,
        Accion: action.payload,
      };

    case "set_Comedia":
      return {
        ...state,
        Comedia: action.payload,
      };
    case "set_Terror":
      return {
        ...state,
        Terror: action.payload,
      };
    case "set_Animadas":
      return {
        ...state,
        Animadas: action.payload,
      };

       case "set_Favoritos":
      return {
        ...state,
        Favoritos: [...state.Favoritos, action.payload],
      };
    default:
      return state;
  }
};