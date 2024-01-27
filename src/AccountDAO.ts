export default interface AccountDAO {
  getById(accountId: string): Promise<any>;
  getByEmail(email: string): Promise<any>;
  save(input: any): Promise<void>;
}
