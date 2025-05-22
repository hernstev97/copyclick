import './styles/main.scss';
import { getVersionString } from './utils/version';
import CopyClickItem from './components/CopyClickItem';
import { v4 as uuidv4 } from 'uuid';
import AddItemSkeleton from './components/AddItemSkeleton';
import ThemeToggle from './components/ThemeToggle';
import { useData } from './contexts/UserData';
import InfoModal from './components/InfoModal';

function App() {
    const versionString = getVersionString();
    const { items, addItem, removeItem, updateItem, clearItems } = useData();

    const addNewItem = () => {
        const numericId = parseInt(uuidv4().replace(/-/g, '').slice(0, 8), 16);
        addItem({ id: numericId, text: '', editState: true });
    };

    return (
        <>
            <div className="cc-app">
                <InfoModal />
                <ThemeToggle />
                <header>
                    <h1>copyclick.</h1>
                    <h3>Just paste it for later and copy with one click.</h3>
                </header>
                <main>
                    {items.length > 0 && (
                        <button
                            className="cc-app--clearAll"
                            onClick={clearItems}
                        >
                            CLEAR ALL
                        </button>
                    )}

                    {items.map((item) => (
                        <CopyClickItem
                            key={item.id}
                            id={item.id}
                            text={item.text}
                            editState={item.editState}
                            onRemove={removeItem}
                            onUpdate={updateItem}
                        />
                    ))}
                    <AddItemSkeleton onClick={addNewItem} />
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
