import RideDAO from "./RideDAO";

export default class GetRide {
  constructor(readonly rideDAO: RideDAO) {
  }

  async execute(rideId: string): Promise<any> {
      return await this.rideDAO.getById(rideId)
  }
}
