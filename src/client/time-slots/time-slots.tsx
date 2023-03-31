import { Col, Row, Space, Tabs, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";

export type TimeSlot = {
  value: string;
  checked?: boolean;
  label: string;
};

export type DailyTimeSlot = {
  date: string;
  label: string;
  contents: TimeSlot[];
};

export type TimeSlotsProps = {
  dailyTimeSlots: DailyTimeSlot[];
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

export const TimeSlots = ({ dailyTimeSlots }: TimeSlotsProps) => {
  const [slots, setSlots] = useState(() => getTimeSlots(dailyTimeSlots));

  const handleChange = (event: CheckboxChangeEvent, value: string) => {
    const { checked } = event.target;

    setSlots((prevSlots) => ({ ...prevSlots, [value]: checked }));
  };

  return (
    <Tabs
      tabPosition="left"
      items={dailyTimeSlots.map(({ date, label, contents }) => ({
        key: date,
        label,
        children: (
          <Space direction="vertical" size="small">
            {contents.map(({ value, label: timeSlotLabel }) => {
              const composedValue = `${date}T${value}`;

              return (
                <Row key={composedValue}>
                  <Col>
                    <Checkbox
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
