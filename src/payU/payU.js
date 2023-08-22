import { URLSearchParams } from "url";
import fetch from "node-fetch";

const encodedParams = new URLSearchParams();
encodedParams.set("key", "JP***g");
encodedParams.set("amount", "10.00");
encodedParams.set("txnid", "txnid8071186464");
encodedParams.set("firstname", "PayU User");
encodedParams.set("email", "test@gmail.com");
encodedParams.set("phone", "9876543210");
encodedParams.set("productinfo", "iPhone");
encodedParams.set(
  "surl",
  "https://test-payment-middleware.payu.in/simulatorResponse"
);
encodedParams.set(
  "furl",
  "https://test-payment-middleware.payu.in/simulatorResponse"
);
encodedParams.set("pg", "");
encodedParams.set("bankcode", "");
encodedParams.set("ccnum", "");
encodedParams.set("ccexpmon", "");
encodedParams.set("ccexpyr", "");
encodedParams.set("ccvv", "");
encodedParams.set("ccname", "");
encodedParams.set("txn_s2s_flow", "");
encodedParams.set(
  "hash",
  "c782a23b2c7b9ebb5d78289182ee15e2c2848c915a2c760885db16446a8c51e6e6adc453195b6ba80973f3856b370bd10ca25dd66b986d64de0990b616a6f714"
);
const url = "https://test.payu.in/merchant/_payment";
const options = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: encodedParams,
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
