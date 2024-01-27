import AccountDAO from "./AccountDAO";

export default class GetAccount {
  constructor(readonly accountDAO: AccountDAO) {
  }

  async execute(accountId: string): Promise<any> {
      return await this.accountDAO.getById(accountId)
  }
}
