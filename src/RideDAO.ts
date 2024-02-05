export default interface RideDAO {
  getById(rideId: string): Promise<any>;
  getRequestedByPassenger(passengerId: string): Promise<any>;
  save(input: any): Promise<void>;
}
