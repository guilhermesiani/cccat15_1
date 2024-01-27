import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

export default class Signup {
  constructor(readonly accountDAO: AccountDAO) {
  }

  async execute(input: any): Promise<any> {
    if (this.invalidEmail(input.email)) return -2;
    if (this.invalidName(input.name)) return -3;
    if (this.invalidCPF(input.cpf)) return -1;
    if (this.invalidCarPlate(input.carPlate)) return -5;
    if (await this.duplicatedEmail(input.email)) return -4;
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
