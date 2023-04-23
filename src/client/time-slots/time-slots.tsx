import {
  Col,
  Row,
  Space,
  Tabs,
  Checkbox,
  Button,
  message,
  Select,
  Form,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { timeSlotsService } from "./time-slots.service";
import { useUser } from "../users/user-context";

export type TimeSlot = {
  value: string;
  checked?: boolean;
  label: string;
  disabled?: boolean;
  practiceAddress: string | null;
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
  const state: Record<
    string,
    { active: boolean; practiceAddress: string | null }
  > = {};

  dailyTimeSlots.forEach(({ date, contents }) => {
    contents.forEach(({ value, checked, practiceAddress }) => {
      const active = Boolean(checked);

      state[`${date}T${value}`] = {
        active,
        practiceAddress: active ? practiceAddress : null,
      };
    });
  });

  return state;
};

export const TimeSlots = ({ dailyTimeSlots, userId }: TimeSlotsProps) => {
  const { user } = useUser();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentAddress, setCurrentAddress] = useState(
    user?.practiceAddresses[0] || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [slots, setSlots] = useState<
    Record<string, { active: boolean; practiceAddress: string | null }>
  >({});

  const handleChange = (event: CheckboxChangeEvent, value: string) => {
    const { checked } = event.target;

    setSlots((prevSlots) => ({
      ...prevSlots,
      [value]: {
        active: checked,
        practiceAddress: checked ? currentAddress : null,
      },
    }));
  };

  const handleAddressChange = (value: string) => {
    setCurrentAddress(value);
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
      <Form labelCol={{ span: 8 }}>
        <Form.Item label="Dirección de atención" style={{ margin: "0 24px" }}>
          <Select
            defaultValue={user?.practiceAddresses[0]}
            style={{ width: "100%" }}
            onChange={handleAddressChange}
            options={(user?.practiceAddresses || []).map((address) => ({
              label: address,
              value: address,
            }))}
          />
        </Form.Item>
      </Form>

      <Tabs
        tabPosition="left"
        items={dailyTimeSlots.map(({ date, label, contents }) => ({
          key: date,
          label,
          children: (
            <Space direction="vertical" size="small">
              {contents.map(({ value, label: timeSlotLabel, disabled }) => {
                const composedValue = `${date}T${value}`;
                const currentSlot = slots[composedValue];

                return (
                  <Row key={composedValue}>
                    <Col>
                      <Checkbox
                        disabled={
                          disabled ||
                          (currentSlot?.practiceAddress != undefined &&
                            currentSlot?.practiceAddress !== currentAddress)
                        }
                        checked={currentSlot?.active}
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
