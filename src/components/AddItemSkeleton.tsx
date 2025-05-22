import type { AddItemSkeletonProps } from '../types/AddItemSkeletonProps';

function AddItemSkeleton({ onClick }: AddItemSkeletonProps) {
    return (
        <>
            <button className="cc-area cc-area--skeleton" onClick={onClick}>
                <div className="cc-area--title-wrapper">
                    <div className="cc-area--title__skeleton"></div>
                    <button
                        className="cc-area--close-button"
                        type="button"
                        title="Remove"
                        aria-label="Close"
                    >
                        <span>Close</span>
                    </button>
                </div>
                <div className="cc-area--textbox cc-area--textbox__edit">
                    {/* Updated SVG that works with fill */}
                    <svg
                        className="cc-area--plus-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                    >
                        {/* This creates a plus sign using filled rectangles */}
                        <rect x="11" y="4" width="2" height="16" />
                        <rect x="4" y="11" width="16" height="2" />
                    </svg>
                </div>
                <div className="cc-area--controls">
                    <div className="cc-area--controls__editSkeleton"></div>
                    <div className="cc-area--controls__clear">
                        <span>Clear</span>
                    </div>
                </div>
            </button>
        </>
    );
}

export default AddItemSkeleton;
