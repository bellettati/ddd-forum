import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteQuestionUseCaseInput {
    authorId: string
    questionId: string
}

type DeleteQuestionUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    object
>

export class DeleteQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
        authorId,
        questionId,
    }: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (question.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        await this.questionsRepository.delete(question)

        return right({})
    }
}