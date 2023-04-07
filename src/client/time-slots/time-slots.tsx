import { Col, Row, Space, Tabs, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { timeSlotsService } from "./time-slots.service";

export type TimeSlot = {
  value: string;
  checked?: boolean;
  label: string;
  disabled?: boolean;
};

export type DailyTimeSlot = {
  date: string;
  label: string;
  contents: TimeSlot[];
};

export type TimeSlotsProps = {
  dailyTimeSlots: DailyTimeSlot[];
  userId: string;
};

const getTimeSlots = (dailyTimeSlots: DailyTimeSlot[]) => {
  const state: Record<string, boolean> = {};

  dailyTimeSlots.forEach(({ date, contents }) => {
    contents.forEach(({ value, checked }) => {
      state[`${date}T${value}`] = Boolean(checked);
    });
  });

  return state;
};

export const TimeSlots = ({ dailyTimeSlots, userId }: TimeSlotsProps) => {
  const [slots, setSlots] = useState<Record<string, boolean>>({});

  const handleChange = (event: CheckboxChangeEvent, value: string) => {
    const { checked } = event.target;

    setSlots((prevSlots) => ({ ...prevSlots, [value]: checked }));

    if (checked) {
      timeSlotsService
        .addTimeSlot({
          status: "FREE",
          practitionerId: userId,
          intervalInMinutes: 60,
          start: new Date(value),
        })
        .then((slot) => {
          if (!slot) {
            setSlots((prevSlots) => ({ ...prevSlots, [value]: false }));
          }
        });
    } else {
      timeSlotsService.removeTimeSlot(userId, value).then((slot) => {
        if (slot) {
          setSlots((prevSlots) => ({ ...prevSlots, [value]: true }));
        }
      });
    }
  };

  useEffect(() => {
    setSlots(getTimeSlots(dailyTimeSlots));
  }, [dailyTimeSlots]);

  return (
    <Tabs
      tabPosition="left"
      items={dailyTimeSlots.map(({ date, label, contents }) => ({
        key: date,
        label,
        children: (
          <Space direction="vertical" size="small">
            {contents.map(({ value, label: timeSlotLabel, disabled }) => {
              const composedValue = `${date}T${value}`;

              return (
                <Row key={composedValue}>
                  <Col>
                    <Checkbox
                      disabled={disabled}
                      checked={slots[composedValue]}
                      onChange={(event) => handleChange(event, composedValue)}
                    >
                      {timeSlotLabel}
                    </Checkbox>
                  </Col>
                </Row>
              );
            })}
          </Space>
        ),
      }))}
    />
  );
};
