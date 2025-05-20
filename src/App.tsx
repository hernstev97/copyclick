import './App.scss';
import { getVersionString } from './utils/version';
import CopyClickItem from './components/CopyClickItem';
import type { CopyClickItemType } from './types/CopyClickItemType';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const versionString = getVersionString();
    const [items, setItems] = useState<CopyClickItemType[]>([
        { id: 1, text: '' },
    ]);

    const addNewItem = () => {
        const numericId = parseInt(uuidv4().replace(/-/g, '').slice(0, 8), 16);
        setItems([...items, { id: numericId, text: '' }]);
    };

    const removeItem = (idToRemove: number) => {
        setItems(items.filter((item) => item.id !== idToRemove));
    };

    return (
        <>
            <div className="site-wrapper">
                <header>
                    <h1>copyclick.</h1>
                    <h3>Just paste it for later and copy with one click.</h3>
                </header>

                <main>
                    {items.map((item) => (
                        <CopyClickItem
                            key={item.id}
                            id={item.id}
                            onRemove={removeItem}
                        />
                    ))}
                    <button className="add-item-button" onClick={addNewItem}>
                        <div>Add Item</div>
                    </button>
                </main>
                <p
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        fontSize: '.8rem',
                    }}
                >
                    (c) Steven Hernandez
                </p>
                <p
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        fontSize: '.8rem',
                    }}
                >
                    {versionString}
                </p>
            </div>
        </>
    );
}

export default App;
