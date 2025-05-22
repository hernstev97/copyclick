import React, { useState, useLayoutEffect, useRef } from 'react';
import type { CopyClickItemProps } from '../types/CopyClickItemProps';

const TEXTAREA_BUFFER = 10; // Buffer to prevent scrollbar from appearing

function CopyClickItem({
    id,
    text,
    editState,
    onRemove,
    onUpdate,
}: CopyClickItemProps) {
    const [copied, setCopied] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    useLayoutEffect(() => {
        adjustTextareaHeight();
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ id, text: e.target.value, editState });
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + TEXTAREA_BUFFER + 'px';
        }
    };

    const handlePaste = () => {
        setTimeout(() => {
            onUpdate({
                id,
                text: textareaRef.current?.value || '',
                editState: false,
            });
        }, 0);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        onUpdate({ id, text: '', editState: true });
    };

    const handleRemove = () => {
        onRemove(id);
    };

    return (
        <>
            <div className="cc-area">
                <div className="cc-area--title-wrapper">
                    <p className="cc-area--title">Title (in progress)</p>
                    <button
                        className="cc-area--close-button"
                        type="button"
                        title="Remove"
                        onClick={handleRemove}
                        aria-label="Close"
                    >
                        Close
                    </button>
                </div>
                <p className={`cc-area--toast ${copied ? 'visible' : ''}`}>
                    copied!
                </p>

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    onPaste={handlePaste}
                    onClick={!editState ? handleCopy : undefined}
                    placeholder={editState ? 'Paste text here...' : ''}
                    name="pastearea"
                    className={`cc-area--textbox ${editState ? 'cc-area--textbox__edit' : 'cc-area--textbox__copy'}`}
                    // rows={1}
                    readOnly={!editState}
                ></textarea>

                <div className="cc-area--controls">
                    <label htmlFor={`editmode-${id}`}>
                        <input
                            type="checkbox"
                            name={`editmode-${id}`}
                            id={`editmode-${id}`}
                            checked={editState}
                            onChange={() =>
                                onUpdate({ id, text, editState: !editState })
                            }
                        />
                        <span>Edit</span>
                    </label>
                    <button
                        onClick={handleClear}
                        className="cc-area--controls__clear"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </>
    );
}

export default CopyClickItem;
