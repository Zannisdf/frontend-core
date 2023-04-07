import { Page } from "@frontend-core/client/layout/page";
import { TimeSlots } from "@frontend-core/client/time-slots";
import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { useUser } from "@frontend-core/client/users/user-context";
import { useEffect, useState } from "react";

export default function Sobrecupos() {
  const [dailyTimeSlots, setDailyTimeSlots] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    timeSlotsService
      .getTimeSlots(user?.user.uid)
      .then((r) => setDailyTimeSlots(r));
  }, []);

  return (
    <Page title="Mis sobrecupos">
      <TimeSlots dailyTimeSlots={dailyTimeSlots} userId={user!.user.uid} />
    </Page>
  );
}
