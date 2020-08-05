import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const checkTransactionId = await transactionRepository.findOne(id);

    if (!checkTransactionId) {
      throw new AppError('Não encontramos o id para delete', 400);
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
