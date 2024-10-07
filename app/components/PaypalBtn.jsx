import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount }) => {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount,
                breakdown: {
                  item_total: { value: amount, currency_code: "USD" },
                },
              },
              description: "Digital Goods Payment",
            },
          ],
          application_context: {
            shipping_preference: "NO_SHIPPING", // For digital goods, shipping is not required
            payment_method: {
              payer_selected: "PAYPAL",
              payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
            },
          },
        });
      }}
      onApprove={async (data, actions) => {
        return actions.order.capture().then(function (details) {
          alert(`Transaction completed by ${details.payer.name.given_name}`);
          // Handle the transaction completion logic here
        });
      }}
      forceReRender={[amount]}
    />
  );
};

export default PayPalButton;
