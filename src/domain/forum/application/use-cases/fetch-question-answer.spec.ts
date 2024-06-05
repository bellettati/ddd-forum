import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers Use Case', () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository()
        answersRepository = new InMemoryAnswersRepository()
        sut = new FetchQuestionAnswersUseCase(answersRepository)
    })

    it('should fetch question answers', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        answersRepository.create(makeAnswer({ questionId: question.id }))
        answersRepository.create(makeAnswer({ questionId: question.id }))
        answersRepository.create(makeAnswer({ questionId: question.id }))

        const result = await sut.execute({
            page: 1,
            questionId: question.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.answers).toHaveLength(3)
    })

    it('should fetch question answers paginated', async () => {
        const question = makeQuestion()
        questionsRepository.create(question)

        for (let i = 0; i < 25; i++) {
            answersRepository.create(makeAnswer({ questionId: question.id }))
        }

        const result = await sut.execute({
            page: 2,
            questionId: question.id.toString(),
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value?.answers).toHaveLength(5)
    })
})
