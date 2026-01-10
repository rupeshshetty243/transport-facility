export interface Ride {
  id: string;
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  time: string; // HH:mm
  pickupPoint: string;
  destination: string;
  bookedBy: string[];
}
