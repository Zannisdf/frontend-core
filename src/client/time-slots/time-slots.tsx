import { Col, Row, Space, Tabs, Checkbox, Button, message } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { timeSlotsService } from "./time-slots.service";
import { useUser } from "../users/user-context";

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
  const { user } = useUser();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSaving, setIsSaving] = useState(false);
  const [slots, setSlots] = useState<Record<string, boolean>>({});

  const handleChange = (event: CheckboxChangeEvent, value: string) => {
    const { checked } = event.target;

    setSlots((prevSlots) => ({ ...prevSlots, [value]: checked }));
  };

  const saveSlots = async () => {
    const currentSlots = { ...slots };
    setIsSaving(true);

    try {
      const result = await timeSlotsService.updateTimeSlots(userId, slots);
      await timeSlotsService.sendNotification(user?.email!, result);

      messageApi.open({
        type: "success",
        content: "¡Sobrecupos guardados!",
      });
    } catch (error) {
      console.log(error);

      messageApi.open({
        type: "error",
        content: "¡Ocurrió un error! Inténtalo de nuevo.",
      });

      setSlots(currentSlots);
    }

    setIsSaving(false);
  };

  useEffect(() => {
    setSlots(getTimeSlots(dailyTimeSlots));
  }, [dailyTimeSlots]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {contextHolder}
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
      <Button
        type="primary"
        block
        style={{ margin: "0 24px", maxWidth: "calc(100% - 48px)" }}
        onClick={saveSlots}
        loading={isSaving}
      >
        Guardar sobrecupos
      </Button>
    </Space>
  );
};
