import type { SnippetDataType } from '../SnippetDataType';

export type CopyClickItemProps = {
    item: SnippetDataType;
    onRemove: (id: string) => void;
    onUpdateContents: (item: SnippetDataType) => void;
};
