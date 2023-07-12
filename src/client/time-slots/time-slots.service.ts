import { db } from "@frontend-core/server/firebase/db";
import {
  addDays,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfHour,
  format,
  isAfter,
  isBefore,
  max,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  writeBatch,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { UserDoc, userService } from "../users/user.service";
import { utcToZonedTime } from "date-fns-tz";

export type TimeSlotDoc = {
  start: Date;
  intervalInMinutes: number;
  practitionerId: string;
  status?: "FREE" | "RESERVED" | "PAID" | "FINISHED" | "NO_SHOW";
  practiceAddress: string;
};

export class TimeSlotsService {
  get(id: string) {
    const ref = doc(db, "timeSlots", id);
    return getDoc(ref)
      .then((snapshot) => snapshot.data() as TimeSlotDoc)
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  addTimeSlot(timeSlot: TimeSlotDoc) {
    return addDoc(collection(db, "timeSlots"), {
      status: "FREE",
      practitionerId: timeSlot.practitionerId,
      intervalInMinutes: 59,
      start: Timestamp.fromDate(timeSlot.start),
    }).catch((error) => {
      console.log(error);
      return null;
    });
  }

  async updateTimeSlot(id: string, data: Partial<TimeSlotDoc>) {
    const ref = doc(db, "timeSlots", id);
    await updateDoc(ref, data);
    const timeSlotDoc = await getDoc(ref);
    const { practitionerId } = timeSlotDoc.data() as TimeSlotDoc;
    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(
      timeSlotsRef,
      where("practitionerId", "==", practitionerId),
      where("start", ">", Timestamp.fromDate(new Date()))
    );
    const user: Partial<UserDoc> & Required<Pick<UserDoc, "latestTimeSlots">> =
      {
        userId: practitionerId,
        latestTimeSlots: [],
      };
    const updatedSnapshots = await getDocs(q);

    updatedSnapshots.forEach((snapshot) => {
      user.latestTimeSlots.push(snapshot.data());
    });

    await userService.editUser(user);
  }

  async updateTimeSlots(
    practitionerId: string,
    timeSlots: Record<
      string,
      { active: boolean; practiceAddress: string | null }
    >
  ) {
    const batch = writeBatch(db);

    const dates = Object.keys(timeSlots);

    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(
      timeSlotsRef,
      where("practitionerId", "==", practitionerId),
      where("start", ">", Timestamp.fromDate(new Date()))
    );
    const snapshots = await getDocs(q);

    const deleted: { date: string; practiceAddress: string }[] = [];
    const updated: { date: string; practiceAddress: string }[] = [];
    const added: { date: string; practiceAddress: string }[] = [];

    snapshots.forEach((snapshot) => {
      const data = snapshot.data();
      const start = data.start.toDate();
      const date = format(start, "yyyy-MM-dd");
      const time = format(start, "HH:mm:ss");
      const dateString = `${date}T${time}`;

      const currentTimeSlot = timeSlots[dateString];

      if (
        !currentTimeSlot?.active ||
        currentTimeSlot?.practiceAddress !== data.practiceAddress
      ) {
        batch.delete(doc(db, "timeSlots", snapshot.id));
        deleted.push({
          date: dateString,
          practiceAddress: data.practiceAddress,
        });
        return;
      }

      if (currentTimeSlot.active) {
        updated.push({
          date: dateString,
          practiceAddress: data.practiceAddress,
        });
      }
    });

    dates.forEach((date) => {
      const timeSlot = timeSlots[date];

      if (
        timeSlot?.active &&
        isAfter(new Date(date), new Date()) &&
        !updated.find((update) => update.date === date)
      ) {
        const ref = doc(collection(db, "timeSlots"));

        batch.set(ref, {
          status: "FREE",
          practitionerId: practitionerId,
          intervalInMinutes: 59,
          start: Timestamp.fromDate(new Date(date)),
          practiceAddress: timeSlot.practiceAddress,
        });

        added.push({ date, practiceAddress: timeSlot.practiceAddress! });
      }
    });

    await batch.commit();

    const user: Partial<UserDoc> & Required<Pick<UserDoc, "latestTimeSlots">> =
      {
        userId: practitionerId,
        latestTimeSlots: [],
      };
    const updatedSnapshots = await getDocs(q);

    updatedSnapshots.forEach((snapshot) => {
      user.latestTimeSlots.push(snapshot.data());
    });

    await userService.editUser(user);

    return {
      added,
      deleted,
    };
  }

  removeTimeSlot(practitionerId: string, dateString: string) {
    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(
      timeSlotsRef,
      where("practitionerId", "==", practitionerId),
      where("start", "==", Timestamp.fromDate(new Date(dateString)))
    );

    return getDocs(q).then((snapshots) => {
      const promises: any = [];

      snapshots.forEach((snapshot) => {
        promises.push(deleteDoc(snapshot.ref));
      });

      return Promise.all(promises)
        .then(() => null)
        .catch((error) => {
          console.log(error);
          return dateString;
        });
    });
  }

  sendNotification(email: string, timeSlots: Record<string, any>) {
    return fetch("/api/notify-time-slot", {
      method: "POST",
      body: JSON.stringify({
        email,
        timeSlots,
      }),
    });
  }

  getTimeSlots(practitionerId: string) {
    const now = new Date();
    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(
      timeSlotsRef,
      where("practitionerId", "==", practitionerId),
      where("start", ">", startOfDay(now))
    );

    const dates = this.getSchedule(now);

    return getDocs(q).then((snapshots) => {
      snapshots.forEach((doc) => {
        const data = doc.data();
        const start = data.start.toDate();

        const date = format(start, "yyyy-MM-dd");
        const time = format(start, "HH:mm:ss");
        const selectedDate = dates.get(date);

        if (selectedDate) {
          dates.set(
            date,
            selectedDate.map((dateValue) =>
              dateValue.value === time
                ? {
                    ...dateValue,
                    checked: true,
                    practiceAddress: data.practiceAddress,
                  }
                : dateValue
            )
          );
        }
      });

      const formattedDates: any[] = [];

      dates.forEach((value, key) => {
        const actualDate = new Date(`${key}T08:00:00`);
        const label = format(actualDate, "iii dd/MM", { locale: es });

        formattedDates.push({
          date: key,
          label: label[0].toUpperCase() + label.slice(1),
          contents: value,
        });
      });

      return formattedDates;
    });
  }

  async getPublicTimeSlots(
    practitionerId: string,
    insuranceProviders: Record<string, string>
  ) {
    const now = utcToZonedTime(new Date(), 'America/Santiago');

    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(
      timeSlotsRef,
      where("practitionerId", "==", practitionerId),
      where("start", ">", Timestamp.fromDate(now)),
      where("start", "<", Timestamp.fromDate(endOfDay(now)))
    );

    const groupedByAddress: Record<string, any> = {};

    return getDocs(q).then((snapshots) => {
      snapshots.forEach((snapshot) => {
        const timeSlot = snapshot.data();
        const start = timeSlot.start.toDate();

        if (timeSlot.status !== "FREE") return;

        groupedByAddress[timeSlot.practiceAddress] = {
          ...groupedByAddress[timeSlot.practiceAddress],
          date: now,
          address: timeSlot.practiceAddress,
          insuranceProviders:
            insuranceProviders[timeSlot.practiceAddress].split(","),
          timeSlots: [
            ...(groupedByAddress[timeSlot.practiceAddress]?.["timeSlots"] ||
              []),
            {
              id: snapshot.id,
              start,
              intervalInMinutes: timeSlot.intervalInMinutes,
            },
          ],
        };
      });

      return {
        date: now,
        results: Object.values(groupedByAddress),
      };
    });
  }

  getSchedule(now: Date) {
    const dates: Map<
      string,
      { value: string; label: string; checked: boolean }[]
    > = new Map();
    const days = eachDayOfInterval({
      start: now,
      end: addDays(now, 6),
    });

    days.forEach((day) => {
      const formattedDay = format(day, "yyyy-MM-dd");
      const start = max([new Date(`${formattedDay}T08:00:00`), endOfHour(day)]);
      const availableHours = eachHourOfInterval({
        start,
        end: new Date(`${formattedDay}T20:00:00`),
      });

      dates.set(
        formattedDay,
        availableHours.map((hour) => ({
          value: format(hour, "HH:mm:ss"),
          label: `${format(hour, "HH:mm")} - ${format(
            endOfHour(hour),
            "HH:mm"
          )}`,
          disabled: isBefore(hour, now),
          checked: false,
        }))
      );
    });

    return dates;
  }
}

export const timeSlotsService = new TimeSlotsService();
