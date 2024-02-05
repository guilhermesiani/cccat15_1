import pgp from "pg-promise"
import crypto from "crypto";
import RideDAO from "./RideDAO"

export default class RideDAODatabase implements RideDAO {
  async getById(rideId: string): Promise<any> {
    const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
    try {
      const result = await connection.query("select * from ride where ride_id = $1", [rideId])
      return result.length > 0 ? result[0] : null;
    } finally {
      await connection.$pool.end();
    }
  }

  async getRequestedByPassenger(passengerId: string): Promise<any> {
    const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
    try {
      const result = await connection.query("select * from ride where passenger_id = $1 and status = $2", [passengerId, "requested"])
      return result.length > 0 ? result[0] : null;
    } finally {
      await connection.$pool.end();
    }
  }

  async save(input: any): Promise<void> {
    const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
    try {
      await connection.query("insert into ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status) values ($1, $2, $3, $4, $5, $6, $7)", [input.rideId, input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong, "requested"]);
    } finally {
      await connection.$pool.end();
    }
  }
}
