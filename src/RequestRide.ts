import crypto from "crypto";
import AccountDAO from './AccountDAO';
import RideDAO from './RideDAO';

export default class RequestRide {
  constructor(
    readonly accountDAO: AccountDAO,
    readonly rideDAO: RideDAO
  ) {
  }

  async execute(input: any): Promise<any> {
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account.is_passenger) throw new Error("Account is not a passenger");
    const ride = await this.rideDAO.getRequestedByPassenger(input.passengerId);
    if (ride) throw new Error("There is a ride requested");
    const obj = {
      rideId: crypto.randomUUID(),
      ...input
    };
    await this.rideDAO.save(obj);
    return {
      rideId: obj.rideId,
    };
  }
}
