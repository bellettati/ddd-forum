import { Entity } from '@/core/entities/entity'

interface AttachmentProps {
    title: string
    link: string
}

export class Attachment extends Entity<AttachmentProps> {
    get title() {
        return this.props.title
    }

    get link() {
        return this.props.link
    }

    static create(props: AttachmentProps) {
        const attachment = new Attachment(props)

        return attachment
    }
}
