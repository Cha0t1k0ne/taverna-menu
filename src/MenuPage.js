import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoF4Cw1dK7hSo00N8MF4yklfnfqRdNP3AjrP8xxwLX0k57OqPwZV7q_SmjqxaeDlhbJJzsQSVYd0It/pub?output=csv";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState("GR");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        const availableItems = data
          .filter(item => item.Available?.toLowerCase() === "true")
          .map(item => ({
            ...item,
            Category: item.Category?.trim() || "",
          }));

        setItems(availableItems);

        const uniqueCategories = [
          ...new Set(availableItems.map(i => i.Category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      },
    });
  }, []);

  const getName = (item) => language === "GR" ? item["Name (GR)"] : item["Name (EN)"];
  const getDescription = (item) => language === "GR" ? item["Description (GR)"] : item["Description (EN)"];

  const filteredItems = activeCategory
    ? items.filter(i => i.Category === activeCategory)
    : items;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Menu</h1>
        <button onClick={() => setLanguage(language === "GR" ? "EN" : "GR")}>
          {language}
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            style={{
              padding: '8px 12px',
              border: '1px solid #333',
              background: cat === activeCategory ? '#333' : 'white',
              color: cat === activeCategory ? 'white' : '#333',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {language === "GR" ? cat : translateCategory(cat)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredItems.map((item, idx) => (
          <div key={idx} style={{ padding: '16px', background: 'white', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{getName(item)}</h2>
            <p style={{ fontStyle: 'italic', color: '#555' }}>{getDescription(item)}</p>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>€ {item.Price}</p>
            {item["Image URL"] && (
              <img
                src={item["Image URL"]}
                alt={getName(item)}
                style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '4px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function translateCategory(grCategory) {
  const dictionary = {
    "ΟΡΕΚΤΙΚΑ": "APPETIZERS",
    "ΣΑΛΑΤΕΣ": "SALADS",
    "ΤΣΙΠΟΥΡΟ ΜΕ ΜΕΖΕ": "TSIPOURO WITH SNACK",
    "ΣΤΟ ΞΥΛΑΚΙ": "THANASI'S LOG",
    "ΠΙΑΤΑ ΤΗΣ ΩΡΑΣ": "COOKED TO ORDER",
    "ΑΝΑΨΥΚΤΙΚΑ-ΜΠΥΡΕΣ": "REFRESHMENTS-BEERS",
    "ΚΡΑΣΙ": "WINE",
    "ΠΟΤΑ": "DRINKS",
  };
  const key = grCategory.trim().toUpperCase();
  return dictionary[key] || grCategory.trim();
}
