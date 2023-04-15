import { db } from "@frontend-core/server/firebase/db";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export type UserDoc = {
  userId: string;
  countryCode: string;
  names: string;
  surnames: string;
  dni: string;
  email: string;
  phone?: string;
  practiceAddress: string;
  licenseId: string;
  specialty: string;
  isActivePractitioner?: boolean;
};

export class UserService {
  editUser(user: UserDoc) {
    const userRef = collection(db, "users");
    const q = query(userRef, where("userId", "==", user.userId));

    return getDocs(q).then((snapshots) => {
      const promises: any = [];

      snapshots.forEach((snapshot) => {
        promises.push(updateDoc(snapshot.ref, user));
      });

      return Promise.all(promises)
        .then(([user]) => user)
        .catch((error) => {
          console.log(error);
          return null;
        });
    });
  }

  getUser(userId: string) {
    const userRef = collection(db, "users");
    const q = query(userRef, where("userId", "==", userId));

    return getDocs(q).then((snapshots) => {
      const data: UserDoc[] = [];

      snapshots.forEach((snapshot) => snapshot.data());

      return data[0];
    });
  }

  async getOrCreateUser(user: any) {
    const userRef = collection(db, "users");
    const q = query(userRef, where("userId", "==", user.uid));

    const snapshots = await getDocs(q);
    const data: any[] = [];

    snapshots.forEach((snapshot) => {
      data.push(snapshot.data())
    });

    if (data.length > 0) {
      return data[0];
    }

    const payload: UserDoc = {
      userId: user.uid,
      countryCode: "CL",
      names: "",
      surnames: "",
      dni: "",
      email: user.email,
      phone: "",
      practiceAddress: "",
      licenseId: "",
      specialty: "",
      isActivePractitioner: false,
    };

    await addDoc(userRef, payload);

    return payload;
  }

  isActivePractitioner(userId: string) {
    return this.getUser(userId).then(
      ({ isActivePractitioner = false }) => isActivePractitioner
    );
  }
}

export const userService = new UserService();
