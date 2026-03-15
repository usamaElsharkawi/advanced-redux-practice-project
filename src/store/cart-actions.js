import {uiActions} from "./ui-slice"
import { cartActions } from "./cart-slice";

export const fetchCartData = () =>{
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(
                "https://reduxcart-c49bb-default-rtdb.firebaseio.com/cart.json",
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch cart data");
            }

            return response.json();
        };

        try{
            const cartData = await fetchData();
            dispatch(cartActions.replaceCart(cartData));
        }
        catch(error){
            dispatch(
                uiActions.showNotification({
                    status: "error",
                    title: "Error!",
                    message: "Failed to fetch cart data!",
                }),
            );

            setTimeout(() => {
                dispatch(uiActions.showNotification(null));
            }, 3000);
        }
    }
}

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
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
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
