export type CopyClickItemProps = {
    id: number;
    title: string;
    text: string;
    editState: boolean;
    onRemove: (id: number) => void;
    onUpdate: (item: {
        id: number;
        title: string;
        text: string;
        editState: boolean;
    }) => void;
};
