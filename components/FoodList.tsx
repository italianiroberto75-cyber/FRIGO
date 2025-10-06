
import React from 'react';
import { FoodItem as FoodItemType } from '../types';
import FoodItem from './FoodItem';

interface FoodListProps {
    items: FoodItemType[];
    onRemoveItem: (id: string) => void;
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    editingItemId: string | null;
    onSetEditingItemId: (id: string | null) => void;
    onUpdateItem: (id: string, updatedData: Partial<Pick<FoodItemType, 'name' | 'category' | 'icon'>>) => void;
    allCategories: string[];
}

const FoodList: React.FC<FoodListProps> = ({ 
    items, 
    onRemoveItem, 
    categories, 
    activeCategory, 
    onSelectCategory,
    editingItemId,
    onSetEditingItemId,
    onUpdateItem,
    allCategories,
}) => {
    if (items.length === 0 && activeCategory === 'Tutte') {
        return (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-lg">
                <i className="fas fa-box-open text-5xl text-slate-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-slate-700">Il tuo frigo è vuoto!</h3>
                <p className="text-slate-500 mt-2">Aggiungi un alimento usando il modulo qui sopra per iniziare.</p>
            </div>
        );
    }

    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || 'Altro';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {} as Record<string, FoodItemType[]>);

    const orderedCategories = Object.keys(groupedItems).sort();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-700 border-b pb-2 mb-4">Contenuto del Frigo</h2>
            
            {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4" role="toolbar" aria-label="Filtri categoria">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex items-center justify-center ${
                                activeCategory === category 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-slate-600 hover:bg-slate-200'
                            }`}
                            aria-pressed={activeCategory === category}
                        >
                            {category === 'Surgelati' && <i className="fas fa-snowflake mr-2" aria-hidden="true"></i>}
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {items.length > 0 ? (
                 orderedCategories.map(category => (
                    <div key={category}>
                        <h3 className="text-lg font-semibold text-slate-600 mb-3 capitalize">{category}</h3>
                        <div className="space-y-3">
                            {groupedItems[category].map(item => (
                                <FoodItem 
                                    key={item.id} 
                                    item={item} 
                                    onRemove={onRemoveItem} 
                                    isEditing={editingItemId === item.id}
                                    onSetEditing={onSetEditingItemId}
                                    onUpdate={onUpdateItem}
                                    allCategories={allCategories}
                                />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 px-6 bg-white rounded-lg shadow-lg">
                    <i className="fas fa-search text-5xl text-slate-400 mb-4"></i>
                    <h3 className="text-xl font-semibold text-slate-700">Nessun risultato</h3>
                    <p className="text-slate-500 mt-2">Non ci sono alimenti che corrispondono alla categoria selezionata.</p>
                </div>
            )}
        </div>
    );
};

export default FoodList;
