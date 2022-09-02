
const initialState = {
    leaves : []
};

const reducer = (state = initialState , action) => {
    switch (action.type) {
       case 'ADD_LEAVES': return  {
             ...state,
             leaves : action.payload
          }
       default: return state;
    }
 }
 export default reducer;