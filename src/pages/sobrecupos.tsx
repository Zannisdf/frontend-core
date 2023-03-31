import { Page } from "@frontend-core/client/layout/page";
import { TimeSlots } from "@frontend-core/client/time-slots";

const contents = [
  { value: "08:00:00", label: "08:00 - 09:00", checked: true },
  { value: "09:00:00", label: "09:00 - 10:00" },
  { value: "10:00:00", label: "10:00 - 11:00" },
  { value: "11:00:00", label: "11:00 - 12:00" },
  { value: "12:00:00", label: "12:00 - 13:00" },
  { value: "13:00:00", label: "13:00 - 14:00" },
  { value: "14:00:00", label: "14:00 - 15:00" },
  { value: "15:00:00", label: "15:00 - 16:00" },
  { value: "16:00:00", label: "16:00 - 17:00" },
  { value: "17:00:00", label: "17:00 - 18:00" },
  { value: "18:00:00", label: "18:00 - 19:00" },
  { value: "19:00:00", label: "19:00 - 20:00" },
  { value: "20:00:00", label: "20:00 - 21:00" },
];

const dailyTimeSlots = [
  { date: "2022-03-31", label: "2022-03-31", contents },
  { date: "2022-04-01", label: "2022-04-01", contents },
  { date: "2022-04-02", label: "2022-04-02", contents },
  { date: "2022-04-03", label: "2022-04-03", contents },
  { date: "2022-04-04", label: "2022-04-04", contents },
  { date: "2022-04-05", label: "2022-04-05", contents },
  { date: "2022-04-06", label: "2022-04-06", contents },
];

export default function Sobrecupos() {
  return (
    <Page title="Mis sobrecupos">
      <TimeSlots dailyTimeSlots={dailyTimeSlots} />
    </Page>
  );
}
