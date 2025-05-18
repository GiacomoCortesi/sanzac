// src/types.ts
export type SlotStatus = "available" | "booked";

export type TimeSlot = {
  startTime: string;
  endTime: string;
  status?: SlotStatus;
  reservedBy?: string;
};
