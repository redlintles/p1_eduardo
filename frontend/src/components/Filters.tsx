interface FiltersProps {
  brand: string;
  model: string;
  minPrice: string;
  maxPrice: string;
  onChange: (field: string, value: string) => void;
}

export default function Filters({
  brand,
  model,
  minPrice,
  maxPrice,
  onChange,
}: FiltersProps) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Marca"
        value={brand}
        onChange={(e) => onChange("brand", e.target.value)}
      />
      <input
        type="text"
        placeholder="Modelo"
        value={model}
        onChange={(e) => onChange("model", e.target.value)}
      />
      <input
        type="number"
        placeholder="Preço mín."
        value={minPrice}
        onChange={(e) => onChange("minPrice", e.target.value)}
      />
      <input
        type="number"
        placeholder="Preço máx."
        value={maxPrice}
        onChange={(e) => onChange("maxPrice", e.target.value)}
      />
    </div>
  );
}
