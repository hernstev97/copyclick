import React, { useState, useLayoutEffect, useRef } from 'react';
import type { CopyClickItemProps } from '../types/props/CopyClickItemProps';
import { COPY_TOAST_DURATION, PASTE_TIMEOUT, TEXTAREA_BUFFER } from '../utils/constants';

// Component to display a single snippet item
function CopyClickItem({
    id,
    title,
    text,
    editState,
    onRemove,
    onUpdate,
}: CopyClickItemProps) {
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Call adjustTextareaHeight on text change
    useLayoutEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    // Call adjustTextareaHeight on mount
    useLayoutEffect(() => {
        adjustTextareaHeight();
    }, []);

    // Update local state on change event
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ id, title, text: e.target.value, editState });
    };

    // Adjust textarea height based on content
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + TEXTAREA_BUFFER + 'px';
        }
    };

    // Update local state on paste event
    const handlePaste = () => {
        setTimeout(() => {
            onUpdate({
                id,
                title,
                text: textareaRef.current?.value || '',
                editState: false,
            });
        }, PASTE_TIMEOUT);
    };

    // Copy text to clipboard
    const handleCopy = async () => {
        try {
            if (!navigator.clipboard) {
                throw new Error('Your browser does not support copying to clipboard');
            }

            await navigator.clipboard.writeText(text);
            setCopied(true);
            setCopyError(null);
            setTimeout(() => setCopied(false), COPY_TOAST_DURATION);
        } catch (error) {
            console.error('Failed to copy text:', error);
            setCopyError('Failed to copy text. Please try again.');
            setTimeout(() => setCopyError(null), COPY_TOAST_DURATION * 2);
        }
    };

    // Clear textarea
    const handleClear = () => {
        onUpdate({ id, title, text: '', editState: true });
    };

    // Remove item
    const handleRemove = () => {
        onRemove(id);
    };

    return (
        <>
            <div className="cc-area">
                <div className="cc-area__title-wrapper">
                    <p className="cc-area__title">{title}</p>
                    <button
                        className="cc-area__close-button"
                        type="button"
                        title="Remove"
                        onClick={handleRemove}
                        aria-label="Close"
                    >
                        Close
                    </button>
                </div>
                <p className={`cc-area__toast ${copied ? 'visible' : ''}`}>
                    Text copied!
                </p>
                {copyError && (
                    <p className="cc-area__toast cc-area__toast--error visible">
                        {copyError}
                    </p>
                )}

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    onPaste={handlePaste}
                    onClick={!editState ? handleCopy : undefined}
                    placeholder={editState ? 'Paste text here...' : ''}
                    name="pastearea"
                    className={`cc-area__textbox ${editState ? 'cc-area__textbox--edit' : 'cc-area__textbox--copy'}`}
                    readOnly={!editState}
                ></textarea>

                <div className="cc-area__controls">
                    <label htmlFor={`editmode-${id}`}>
                        <input
                            type="checkbox"
                            name={`editmode-${id}`}
                            id={`editmode-${id}`}
                            checked={editState}
                            onChange={() =>
                                onUpdate({
                                    id,
                                    title,
                                    text,
                                    editState: !editState,
                                })
                            }
                        />
                        <span>Edit</span>
                    </label>
                    <button
                        onClick={handleClear}
                        className="cc-area__controls--clear"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </>
    );
}

export default CopyClickItem;
