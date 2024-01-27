import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

export default class Signup {
  constructor(readonly accountDAO: AccountDAO) {
  }

  async execute(input: any): Promise<any> {
    if (this.invalidEmail(input.email)) throw new Error("invalid email");
    if (this.invalidName(input.name)) throw new Error("invalid name");
    if (this.invalidCPF(input.cpf)) throw new Error("invalid cpf");
    if (this.invalidCarPlate(input.carPlate)) throw new Error("invalid car plate");
    if (await this.duplicatedEmail(input.email)) throw new Error("email already exists");
    return await this.saveAccount(input);
  }

  invalidName(name: string) {
    return !name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  invalidEmail(email: string) {
    return !email.match(/^(.+)@(.+)$/);
  }

  invalidCPF(cpf: string) {
    return !validateCpf(cpf);
  }

  invalidCarPlate(carPlate: string) {
    return carPlate && !carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }

  async duplicatedEmail(email: string) {
    return await this.accountDAO.getByEmail(email);
  }

  async saveAccount(input: any) {
    const obj = {
      accountId: crypto.randomUUID(),
      ...input
    };
    await this.accountDAO.save(obj);
    return obj;
  }
}
