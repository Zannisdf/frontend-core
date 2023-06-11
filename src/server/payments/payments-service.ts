import { createHmac } from "crypto";

export class PaymentsService {
  createPayment({
    itemId,
    description,
    amount,
    email,
  }: {
    itemId: string;
    description: string;
    amount: number;
    email: string;
  }) {
    const body = new URLSearchParams({
      apiKey: String(process.env.PAYMENT_PROVIDER_FLOW_API_KEY),
      commerceOrder: itemId,
      subject: description,
      amount: String(amount),
      email,
      urlConfirmation: String(
        process.env.PAYMENT_PROVIDER_FLOW_CONFIRMATION_URL
      ),
      urlReturn: String(process.env.PAYMENT_PROVIDER_FLOW_RETURN_URL),
    });

    this.addSignature(body);

    return fetch(String(process.env.PAYMENT_PROVIDER_FLOW_CREATE_PAYMENT_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.text().then((error) => {
        throw new Error(error);
      });
    });
  }

  getPaymentStatus(token: string) {
    const params = new URLSearchParams({
      apiKey: String(process.env.PAYMENT_PROVIDER_FLOW_API_KEY),
      token,
    });

    this.addSignature(params);

    return fetch(
      `${process.env.PAYMENT_PROVIDER_FLOW_STATUS_URL}?${params.toString()}`
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.text().then((error) => {
        throw new Error(error);
      });
    });
  }

  addSignature(params: URLSearchParams) {
    const keys = Object.keys(Object.fromEntries(params)).sort();
    let signatureContent = "";

    keys.forEach((key) => {
      signatureContent = `${signatureContent}${key}${params.get(key)}`;
    });

    const signature = createHmac(
      "sha256",
      String(process.env.PAYMENT_PROVIDER_FLOW_SECRET)
    )
      .update(signatureContent)
      .digest("hex");

    params.append("s", signature);
  }
}

export const paymentsService = new PaymentsService();
