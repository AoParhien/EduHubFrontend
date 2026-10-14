import React, { useRef } from 'react';
import './TabBar.css';

/*
 * Horizontally scrollable pill tabs.
 * `tabs` is a list of { value, label } (plain strings also work).
 */
const TabBar = ({ tabs, value, onSelect, label = 'Filter' }) => {
    const listRef = useRef(null);
    const items = tabs.map((tab) => (typeof tab === 'string' ? { value: tab, label: tab } : tab));

    const handleKeyDown = (event, index) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
        onSelect(items[next].value);
        listRef.current?.querySelectorAll('button')[next]?.focus();
    };

    return (
        <div className="tabbar" role="tablist" aria-label={label} ref={listRef}>
            {items.map((tab, index) => {
                const isSelected = tab.value === value;
                return (
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        className={`tabbar__tab${isSelected ? ' is-selected' : ''}`}
                        onClick={() => onSelect(tab.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default TabBar;
