import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseInput {
    authorId: string
    answerCommentId: string
}
type DeleteAnswerCommentUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError,
    object
>

export class DeleteAnswerCommentUseCase {
    constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentUseCaseInput): Promise<DeleteAnswerCommentUseCaseOutput> {
        const answerComment = await this.answerCommentsRepository.findById(
            answerCommentId
        )

        if (!answerComment) {
            return left(new ResourceNotFoundError())
        }

        if (answerComment.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        await this.answerCommentsRepository.delete(answerComment)

        return right({})
    }
}
