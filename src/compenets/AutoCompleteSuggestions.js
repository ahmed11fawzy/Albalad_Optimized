import React from 'react';
import '../css/AutoCompleteSuggestions.css';

const staticSuggestions = [
  'هاتف سامسونج',
  'ايفون 15',
  'لاب توب',
  'سماعات بلوتوث',
  'غلاية كهربائية',
  'مكواة بخار',
  'ثلاجة صغيرة',
  'ساعة ذكية',
  'خلاط كهربائي',
];

export default function AutoCompleteSuggestions({ searchQuery, setSearchQuery }) {
  // فلترة الاقتراحات بناءً على النص المدخل
  const filtered = staticSuggestions.filter(s => s.includes(searchQuery));
  return (
    <div className="autocomplete-suggestions-popup">
      {filtered.length === 0 ? (
        <div className="autocomplete-suggestion-empty">لا توجد اقتراحات</div>
      ) : (
        filtered.map((s, i) => (
          <div
            className="autocomplete-suggestion-item"
            key={i}
            onClick={() => setSearchQuery && setSearchQuery(s)}
          >
            {s}
          </div>
        ))
      )}
    </div>
  );
} 