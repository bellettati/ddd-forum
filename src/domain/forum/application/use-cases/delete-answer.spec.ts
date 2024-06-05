import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let answersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
    beforeEach(() => {
        answersRepository = new InMemoryAnswersRepository()
        sut = new DeleteAnswerUseCase(answersRepository)
    })

    it('should delete an answer', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityId('author-1') },
            new UniqueEntityId('answer-1')
        )
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: 'author-1',
            answerId: 'answer-1',
        })

        expect(result.isRight()).toBeTruthy()
        expect(answersRepository.items).toHaveLength(0)
    })

    it('should not delete answer from another author', async () => {
        const answer = makeAnswer(
            { authorId: new UniqueEntityId('author-1') },
            new UniqueEntityId('answer-1')
        )
        answersRepository.create(answer)

        const result = await sut.execute({
            authorId: 'author-2',
            answerId: answer.id.toString(),
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})