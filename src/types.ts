// src/types.ts
export type SlotStatus = "available" | "booked" | "unavailable";

export type TimeSlot = {
  time: string;
  status: SlotStatus;
  reservedBy?: string;
};
