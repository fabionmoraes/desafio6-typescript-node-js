import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Você ultrapassou o valor do total', 400);
    }

    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title: category_id },
    });

    const transactionRepository = getRepository(Transaction);

    if (!category) {
      const categorie = categoryRepository.create({
        title: category_id,
      });

      await categoryRepository.save(categorie);

      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: categorie.id,
      });

      await transactionRepository.save(transaction);

      return transaction;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
