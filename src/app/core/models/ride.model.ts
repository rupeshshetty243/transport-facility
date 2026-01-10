export type VehicleType = 'Car' | 'Bike';

export interface Ride {
  id: string;          // Unique ID for the system to track the record
  employeeId: string;  // ID of the person offering the ride
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  time: string;        // Format "HH:mm" (24-hour format)
  pickupPoint: string;
  destination: string;
}
