import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findtransactions = await this.find();

    const filterIcome = findtransactions.filter(item => item.type === 'income');
    const filterOutcome = findtransactions.filter(
      item => item.type === 'outcome',
    );

    const percorreIcome =
      filterIcome.length > 0 ? filterIcome.map(item => item.value) : false;
    const percorreOutcome =
      filterOutcome.length > 0 ? filterOutcome.map(item => item.value) : false;

    const somaIncome = percorreIcome
      ? percorreIcome.reduce((accum, cur) => accum + cur)
      : 0;
    const somaOutcome = percorreOutcome
      ? percorreOutcome.reduce((accum, cur) => accum + cur)
      : 0;

    const dados = somaIncome - somaOutcome;

    const object = {
      income: somaIncome,
      outcome: somaOutcome,
      total: dados,
    };

    return object;
  }
}

export default TransactionsRepository;
