import { createSlice } from "@reduxjs/toolkit";
import {uiActions} from "./ui-slice";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalQuantity: 0, totalPrice: 0 },
  reducers: {
    addItem(state, action) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice += action.payload.price;
        state.totalQuantity++;
      } else {
        state.items.push({
          id: action.payload.id,
          price: action.payload.price,
          quantity: 1,
          totalPrice: action.payload.price,
          name: action.payload.name,
        });
        state.totalQuantity++;
        state.totalPrice += action.payload.price;
      }
    },
    removeItem(state, action) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
        state.totalQuantity--;
        state.totalPrice -= existingItem.price;
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
        state.totalQuantity--;
      }
    },
  },
});

export const sendCartData =  (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data...",
      }),
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://reduxcart-c49bb-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send cart data");
      }
    };

    try{
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Cart data sent successfully!",
        }),
      );

      setTimeout(() => {
        dispatch(uiActions.showNotification(null));
      }, 3000);
    }
    catch(error){
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Failed to send cart data!",
        }),
      );

      setTimeout(() => {
        dispatch(uiActions.showNotification(null));
      }, 3000);
    }
  };
};

export const cartActions = cartSlice.actions;
export default cartSlice;
