import React from 'react';
import { useScreenSize } from '../utils/useScreenSize';

/**
 * ResponsiveCardGrid — Adaptive Card Grid Component for KALAM 2026
 *
 * Rules:
 * 1. Mobile (< 768px):
 *    - Always exactly 2 columns per row (`grid-cols-2`).
 *    - When the final row has only 1 card, it stays in the first column and leaves the second column empty.
 *    - Never stretches single cards across both columns on mobile.
 *    - CSS-enforced via `grid grid-cols-2 md:hidden` so mobile is ALWAYS 2 columns even before JS hydration.
 *
 * 2. Desktop & Tablet (>= 768px):
 *    - Adapts each row independently to the actual number of cards in that row.
 *    - Incomplete rows display across only the number of columns required (e.g. 3 cards -> 3 cols, 2 cards -> 2 cols, 1 card -> 1 col).
 *    - Event Page specifically enforces 2 cards per row on desktop and tablet.
 *    - Controlled via `hidden md:flex flex-col`.
 */
const ResponsiveCardGrid = ({
    items = [],
    renderItem,
    maxCols = 4,
    tabletCols,
    isEventPage = false,
    gap = 'gap-2.5 sm:gap-4 md:gap-5',
    className = '',
    emptyState = null,
}) => {
    const { isTablet } = useScreenSize();

    if (!Array.isArray(items) || items.length === 0) {
        return emptyState;
    }

    // Determine desktop/tablet effective columns per row
    let effectiveCols = maxCols;
    if (isEventPage) {
        effectiveCols = 2;
    } else if (isTablet) {
        effectiveCols = tabletCols || Math.min(2, maxCols);
    }

    // Partition items into independent rows of at most effectiveCols
    const rows = [];
    for (let i = 0; i < items.length; i += effectiveCols) {
        rows.push(items.slice(i, i + effectiveCols));
    }

    return (
        <div className="w-full">
            {/* 1. Mobile View (< 768px): Strictly 2 columns per row via pure CSS */}
            <div className={`grid grid-cols-2 md:hidden ${gap} ${className}`}>
                {items.map((item, index) => (
                    <div
                        key={`m-${item?._id || item?.id || item?.code || index}`}
                        className="w-full min-w-0"
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>

            {/* 2. Desktop & Tablet View (>= 768px): Dynamic row-wise adaptive layout */}
            <div className={`hidden md:flex flex-col ${gap} ${className}`}>
                {rows.map((row, rowIndex) => {
                    const count = row.length;
                    return (
                        <div
                            key={`d-row-${rowIndex}`}
                            className={`grid w-full ${gap}`}
                            style={{
                                gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`
                            }}
                        >
                            {row.map((item, itemIndex) => {
                                const globalIndex = rowIndex * effectiveCols + itemIndex;
                                return (
                                    <div
                                        key={`d-${item?._id || item?.id || item?.code || globalIndex}`}
                                        className={`w-full min-w-0 ${count === 1 && effectiveCols > 1 ? 'max-w-xl mx-auto' : ''}`}
                                    >
                                        {renderItem(item, globalIndex)}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResponsiveCardGrid;
