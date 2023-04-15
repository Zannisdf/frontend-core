import { WithAuth } from "@frontend-core/client/authentication/with-auth";
import { Page } from "@frontend-core/client/layout/page";
import { TimeSlots } from "@frontend-core/client/time-slots";
import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { useUser } from "@frontend-core/client/users/user-context";
import { useEffect, useState } from "react";

const TimeSlotsPage = () => {
  const [dailyTimeSlots, setDailyTimeSlots] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    timeSlotsService.getTimeSlots(user.userId).then((r) => setDailyTimeSlots(r));
  }, []);

  return user ? (
    <Page title="Sobrecupos para los siguientes siete días" seoTitle="Mis sobrecupos | Sobrecupos" >
      <TimeSlots dailyTimeSlots={dailyTimeSlots} userId={user.userId} />
    </Page>
  ) : null;
};

export default WithAuth(TimeSlotsPage);
