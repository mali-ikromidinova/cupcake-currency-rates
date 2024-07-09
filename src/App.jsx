import "./App.css";
import CurrencyTable from "./currency-table/CurrencyTable";

function App() {
  return (
    <div className="app">
      <div className="table-wrapper">
        <h1>Real-time Currency Rates</h1>
        <CurrencyTable />
      </div>
    </div>
  );
}

export default App;
