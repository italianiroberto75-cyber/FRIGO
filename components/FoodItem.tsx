
import React from 'react';
import { FoodItem as FoodItemType } from '../types';
import EditItemForm from './EditItemForm';

interface FoodItemProps {
    item: FoodItemType;
    onRemove: (id: string) => void;
    isEditing: boolean;
    onSetEditing: (id: string | null) => void;
    onUpdate: (id: string, updatedData: Partial<{ name: string; category: string; icon: string; }>) => void;
    allCategories: string[];
}

const FoodItem: React.FC<FoodItemProps> = ({ item, onRemove, isEditing, onSetEditing, onUpdate, allCategories }) => {
    
    if (isEditing) {
        return <EditItemForm 
                  item={item}
                  onSave={(updatedData) => onUpdate(item.id, updatedData)}
                  onCancel={() => onSetEditing(null)}
                  allCategories={allCategories}
               />
    }

    const getExpiryInfo = () => {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0,0,0,0);
        
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let text = `Scade il ${new Date(item.expiryDate).toLocaleDateString('it-IT')}`;
        let colorClasses = 'bg-green-100 text-green-800';
        let icon = 'fa-solid fa-leaf';

        if (item.isFrozen && diffDays > 30) {
            colorClasses = 'bg-blue-100 text-blue-800';
            icon = 'fa-solid fa-snowflake';
        } else if (diffDays < 0) {
            text = `Scaduto da ${Math.abs(diffDays)} giorni`;
            colorClasses = 'bg-red-100 text-red-800';
            icon = 'fa-solid fa-triangle-exclamation';
        } else if (diffDays === 0) {
            text = 'Scade oggi';
            colorClasses = 'bg-red-100 text-red-800';
            icon = 'fa-solid fa-triangle-exclamation';
        } else if (diffDays <= 3) {
            text = `Scade tra ${diffDays} giorni`;
            colorClasses = 'bg-yellow-100 text-yellow-800';
            icon = 'fa-solid fa-hourglass-half';
        }

        return { text, colorClasses, icon };
    };

    const { text, colorClasses, icon } = getExpiryInfo();

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between transition-transform duration-200 hover:shadow-xl hover:scale-105 group">
            <div onClick={() => onSetEditing(item.id)} className="flex items-center flex-grow gap-4 cursor-pointer">
                 <div className="w-8 text-center">
                     <i className={`fa-solid ${item.icon || 'fa-utensils'} text-xl text-orange-500`} aria-hidden="true"></i>
                 </div>
                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-slate-800 capitalize">{item.name}</p>
                        {item.isFrozen && <i className="fas fa-snowflake text-blue-500" title="Congelato"></i>}
                    </div>
                    <div className={`text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded-full mt-1 ${colorClasses}`}>
                        <i className={`mr-1.5 ${icon}`}></i>
                        {text}
                    </div>
                </div>
            </div>
            <button
                onClick={() => onRemove(item.id)}
                className="ml-4 text-slate-400 hover:text-red-600 focus:text-red-600 focus:outline-none transition-colors duration-200 flex-shrink-0 opacity-0 group-hover:opacity-100"
                aria-label={`Rimuovi ${item.name}`}
            >
                <i className="fas fa-trash-alt fa-lg"></i>
            </button>
        </div>
    );
};

export default FoodItem;
