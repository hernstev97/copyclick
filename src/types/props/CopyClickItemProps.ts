import type { SnippetDataType } from '../SnippetDataType';

export type CopyClickItemProps = {
    id: string;
    title: string;
    text: string;
    editState: boolean;
    onRemove: (id: string) => void;
    onUpdate: (item: SnippetDataType) => void;
};
