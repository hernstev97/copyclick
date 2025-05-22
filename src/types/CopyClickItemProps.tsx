export type CopyClickItemProps = {
    id: number;
    text: string;
    editState: boolean;
    onRemove: (id: number) => void;
    onUpdate: (item: { id: number; text: string; editState: boolean }) => void;
};
