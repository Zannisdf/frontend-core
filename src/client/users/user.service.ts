import { db } from "@frontend-core/server/firebase/db";
import {
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
}
