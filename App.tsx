
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FoodItem as FoodItemType } from './types';
import AddItemForm from './components/AddItemForm';
import FoodList from './components/FoodList';
import { foodCategories } from './services/geminiService';

const App: React.FC = () => {
    const [foodItems, setFoodItems] = useState<FoodItemType[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('Tutte');
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const storedItems = localStorage.getItem('foodItems');
            if (storedItems) {
                setFoodItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error("Impossibile caricare gli articoli dal localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('foodItems', JSON.stringify(foodItems));
        } catch (error) {
            console.error("Impossibile salvare gli articoli nel localStorage", error);
        }
    }, [foodItems]);

    const handleAddItem = useCallback((item: FoodItemType) => {
        setFoodItems(prevItems => [...prevItems, item].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()));
    }, []);

    const handleRemoveItem = useCallback((id: string) => {
        setFoodItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const handleUpdateItem = useCallback((id: string, updatedData: Partial<Pick<FoodItemType, 'name' | 'category' | 'icon'>>) => {
        setFoodItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, ...updatedData } : item
            ).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
        );
        setEditingItemId(null);
    }, []);
    
    const displayCategories = useMemo(() => {
        const filters: string[] = ['Tutte'];
        if (foodItems.some(item => item.isFrozen)) {
            filters.push('Surgelati');
        }
        const uniqueCategories = [...new Set(foodItems.map(item => item.category))].sort();
        return [...filters, ...uniqueCategories];
    }, [foodItems]);
    
    const filteredItems = useMemo(() => {
        if (activeCategory === 'Tutte') {
            return foodItems;
        }
        if (activeCategory === 'Surgelati') {
            return foodItems.filter(item => item.isFrozen);
        }
        return foodItems.filter(item => item.category === activeCategory);
    }, [foodItems, activeCategory]);


    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <i className="fas fa-carrot text-4xl text-orange-500"></i>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-700">Gestore Frigo Intelligente</h1>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-slate-600">Aggiungi un Alimento</h2>
                        <AddItemForm onAddItem={handleAddItem} />
                    </section>
                    
                    <section>
                         <FoodList 
                            items={filteredItems} 
                            onRemoveItem={handleRemoveItem}
                            categories={displayCategories}
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                            editingItemId={editingItemId}
                            onSetEditingItemId={setEditingItemId}
                            onUpdateItem={handleUpdateItem}
                            allCategories={foodCategories}
                         />
                    </section>
                </div>
            </main>

            <footer className="text-center py-4 text-slate-500 text-sm">
                <p>Creato con React e Gemini API</p>
            </footer>
        </div>
    );
};

export default App;
