import { db } from "@frontend-core/server/firebase/db";
import { isBefore } from "date-fns";
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
  practiceAddresses: string[];
  licenseId: string;
  specialty: string;
  isActivePractitioner?: boolean;
  isSuperUser?: boolean;
  description?: string;
  picture?: string;
  code: string;
  addressTags?: string[];
  insuranceProviders?: string[];
  hidden?: boolean;
  latestTimeSlots: Record<string, any>[];
};

export class UserService {
  editUser(user: Partial<UserDoc>) {
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

  activateUser({
    email,
    practiceAddresses,
  }: {
    email: string;
    practiceAddresses: string[];
  }) {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));

    let sendEmail = false;

    return getDocs(q).then((snapshots) => {
      const promises: any = [];

      snapshots.forEach((snapshot) => {
        const data = snapshot.data();

        if (data.isActivePractitioner) {
          promises.push(Promise.resolve({ sendEmail: true, user: data }));
        } else {
          promises.push(
            updateDoc(snapshot.ref, {
              isActivePractitioner: true,
              practiceAddresses,
            })
          );
          sendEmail = true;
        }
      });

      return Promise.all(promises)
        .then(([user]) => {
          if (sendEmail) {
            this.notifyUserActivated(email);
          }

          return user;
        })
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

      snapshots.forEach((snapshot) => data.push(snapshot.data() as UserDoc));

      return data[0];
    });
  }

  async getOrCreateUser(user: any, email?: string) {
    const userRef = collection(db, "users");
    const predicate = email
      ? where("email", "==", email)
      : where("userId", "==", user.uid);
    const q = query(userRef, predicate);

    const snapshots = await getDocs(q);
    const data: any[] = [];

    snapshots.forEach((snapshot) => {
      data.push(snapshot.data());
    });

    if (data.length > 0) {
      return data[0];
    }

    const payload: Partial<UserDoc> = {
      userId: user.uid,
      countryCode: "CL",
      names: "",
      surnames: "",
      dni: "",
      email: user.email,
      phone: "",
      practiceAddress: "",
      practiceAddresses: [],
      licenseId: "",
      specialty: "",
      isActivePractitioner: false,
    };

    await addDoc(userRef, payload);

    this.notifyUserCreated(user.email).catch((error) => console.log(error));

    return payload;
  }

  notifyUserCreated(email: string) {
    return fetch("/api/notify-user-created", {
      method: "POST",
      body: JSON.stringify({
        email,
        activationLink: `https://www.sobrecupos.app/activar-usuario?email=${email}`,
      }),
    });
  }

  notifyUserActivated(email: string) {
    return fetch("/api/notify-user-activated", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
  }

  isActivePractitioner(userId: string) {
    return this.getUser(userId).then(
      ({ isActivePractitioner = false }) => isActivePractitioner
    );
  }

  listUsers() {
    const userRef = collection(db, "users");

    return getDocs(userRef).then((snapshots) => {
      const data: UserDoc[] = [];

      snapshots.forEach((snapshot) => data.push(snapshot.data() as UserDoc));

      return data;
    });
  }

  getPractitionersBySpecialty(specialtyId: string) {
    const userRef = collection(db, "users");
    const q = query(
      userRef,
      where("specialty", "==", specialtyId),
      where("hidden", "!=", true)
    );

    return getDocs(q).then((snapshots) => {
      const data: UserDoc[] = [];

      snapshots.forEach((snapshot) => {
        const user = snapshot.data();
        const now = new Date();

        user.latestTimeSlots ||= [];
        user.latestTimeSlots = user.latestTimeSlots
          .filter((timeSlot: any) => timeSlot.status === "FREE")
          .map((timeSlot: any) => timeSlot.start.toDate())
          .filter((date: Date) => isBefore(now, date));

        data.push(user as UserDoc);
      });

      data.sort(
        (userA, userB) =>
          userB.latestTimeSlots.length - userA.latestTimeSlots.length
      );

      return data;
    });
  }

  async getPractitionerByCode(code: string) {
    const userRef = collection(db, "users");
    const q = query(userRef, where("code", "==", code));

    return getDocs(q).then((snapshots) => {
      const data: UserDoc[] = [];

      snapshots.forEach((snapshot) => data.push(snapshot.data() as UserDoc));

      return data[0];
    });
  }
}

export const userService = new UserService();
