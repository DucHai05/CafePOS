import React from 'react';

const CategoryTab = ({ categories, activeId, onSelect }) => {
    return (
        <div className="category-scroll">
            {categories.map((cat) => (
                <div 
                    key={cat.id} 
                    className={`category-item ${activeId === cat.id ? 'active' : ''}`} 
                    onClick={() => onSelect(cat.id)}
                >
                    {/* Hải có thể thêm Icon ở đây nếu muốn sau này */}
                    <span className="cat-name">{cat.name}</span>
                </div>
            ))}
        </div>
    );
};

export default CategoryTab;