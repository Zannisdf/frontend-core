import { Page } from "@frontend-core/client/layout/page";
import { TimeSlots } from "@frontend-core/client/time-slots";
import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { useEffect, useState } from "react";

export default function Sobrecupos() {
  const [dailyTimeSlots, setDailyTimeSlots] = useState<any[]>([]);

  useEffect(() => {
    timeSlotsService.getTimeSlots().then((r) => setDailyTimeSlots(r));
  }, []);

  return (
    <Page title="Mis sobrecupos">
      <TimeSlots dailyTimeSlots={dailyTimeSlots} />
    </Page>
  );
}
