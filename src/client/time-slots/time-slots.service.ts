import { db } from "@frontend-core/server/firebase/db";
import {
  addDays,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfHour,
  format,
  max,
} from "date-fns";
import {
  collection,
  addDoc,
  deleteDoc,
  DocumentReference,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
} from "firebase/firestore";

export type TimeSlotDoc = {
  start: Date;
  intervalInMinutes: 60;
  practitionerId: string;
  status?: "FREE" | "RESERVED" | "PAID" | "FINISHED" | "NO_SHOW";
};

export class TimeSlotsService {
  addTimeSlot(timeSlot: TimeSlotDoc) {
    return addDoc(collection(db, "timeSlots"), {
      status: "FREE",
      practitionerId: "1",
      intervalInMinutes: 60,
      start: Timestamp.fromDate(timeSlot.start),
    }).catch((error) => {
      console.log(error);
      return null;
    });
  }

  removeTimeSlot(dateString: string) {
    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(
      timeSlotsRef,
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

  getTimeSlots(_practitionerId = "1") {
    const now = new Date();
    const timeSlotsRef = collection(db, "timeSlots");
    const q = query(timeSlotsRef, where("start", ">=", now));

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
            selectedDate.map((dateValue) => ({
              ...dateValue,
              checked: dateValue.checked || time === dateValue.value,
            }))
          );
        }
      });

      const formattedDates: any[] = [];

      dates.forEach((value, key) => {
        formattedDates.push({
          date: key,
          label: key,
          contents: value,
        });
      });

      return formattedDates;
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
          checked: false,
        }))
      );
    });

    return dates;
  }
}

export const timeSlotsService = new TimeSlotsService();
