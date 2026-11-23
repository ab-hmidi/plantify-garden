const plants = [
  { id: 1, name: "Monstera Deliciosa", price: 29.99 },
  { id: 2, name: "Ficus Lyrata", price: 39.99 },
  { id: 3, name: "Pothos", price: 19.99 },
];

export default function PlantList() {
  return (
    <div>
      <h2>Nos plantes</h2>

      {plants.map((plant) => (
        <div key={plant.id}>
          <h3>{plant.name}</h3>
          <p>{plant.price} €</p>
        </div>
      ))}
    </div>
  );
}
