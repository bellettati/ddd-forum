import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerAttachmentList } from './answer-attachment-list'

export interface AnswerProps {
    authorId: UniqueEntityId
    questionId: UniqueEntityId
    content: string
    attachments: AnswerAttachmentList
    createdAt: Date
    updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
    get authorId() {
        return this.props.authorId
    }

    get questionId() {
        return this.props.questionId
    }

    get content() {
        return this.props.content
    }

    set content(content: string) {
        this.props.content = content

        this.touch()
    }

    get attachments() {
        return this.props.attachments
    }

    set attachments(attachments: AnswerAttachmentList) {
        this.props.attachments = attachments
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    static create(
        props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
        id?: UniqueEntityId
    ) {
        const question = new Answer(
            {
                ...props,
                attachments: props.attachments ?? new AnswerAttachmentList(),
                createdAt: props.createdAt ?? new Date(),
            },
            id
        )

        return question
    }

    private touch() {
        this.props.updatedAt = new Date()
    }
}
