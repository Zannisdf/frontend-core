import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/db";

export type OrderDoc = {
  itemId: string;
  start: Date;
  intervalInMinutes: number;
  practitionerId: string;
  practitionerName: string;
  practitionerEmail: string;
  practiceAddress: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  authorization: boolean;
  termsAndConditions: boolean;
  status: "PENDING" | "PAID";
  createdAt: Date;
  updatedAt: Date;
};

export class OrdersClient {
  get(id: string) {
    const ref = doc(db, "orders", id);
    return getDoc(ref)
      .then((snapshot) => {
        const data = snapshot.data();

        if (!data) return null;

        return {
          ...data,
          start: data.start.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as OrderDoc;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  create(id: string, payload: Omit<OrderDoc, "createdAt" | "updatedAt">) {
    return setDoc(doc(db, "orders", id), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch((error) => {
      console.log(error);
      return null;
    });
  }

  update(id: string, data: Partial<OrderDoc>) {
    const ref = doc(db, "timeSlots", id);
    return updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  delete(id: string) {
    const ref = doc(db, "timeSlots", id);
    return deleteDoc(ref);
  }
}

export const ordersClient = new OrdersClient();
