export default interface RideDAO {
  getRequestedByPassenger(passengerId: string): Promise<any>;
  save(input: any): Promise<void>;
}
