import { useState, useEffect, useCallback } from "react";
import "./CurrencyTable.css";

const BASE_URL = "http://localhost:3000/api/v1";

const CurrencyTable = () => {
  const [rates, setRates] = useState({
    RUB_CUPCAKE: { first: null, second: null, third: null },
    USD_CUPCAKE: { first: null, second: null, third: null },
    EUR_CUPCAKE: { first: null, second: null, third: null },
    RUB_USD: { first: null, second: null, third: null },
    RUB_EUR: { first: null, second: null, third: null },
    EUR_USD: { first: null, second: null, third: null },
  });

  const fetchInitialRates = async () => {
    try {
      const [firstResponse, secondResponse, thirdResponse] = await Promise.all([
        fetch(`${BASE_URL}/first`),
        fetch(`${BASE_URL}/second`),
        fetch(`${BASE_URL}/third`),
      ]);

      const [firstData, secondData, thirdData] = await Promise.all([
        firstResponse.json(),
        secondResponse.json(),
        thirdResponse.json(),
      ]);

      const initialRates = {
        RUB_CUPCAKE: {
          first: firstData.rates["RUB"].toFixed(2),
          second: secondData.rates["RUB"].toFixed(2),
          third: thirdData.rates["RUB"].toFixed(2),
        },
        USD_CUPCAKE: {
          first: firstData.rates["USD"].toFixed(2),
          second: secondData.rates["USD"].toFixed(2),
          third: thirdData.rates["USD"].toFixed(2),
        },
        EUR_CUPCAKE: {
          first: firstData.rates["EUR"].toFixed(2),
          second: secondData.rates["EUR"].toFixed(2),
          third: thirdData.rates["EUR"].toFixed(2),
        },
      };

      const calculatedRates = calculateCrossRates(initialRates);
      setRates(calculatedRates);
    } catch (error) {
      console.error("Error fetching initial rates", error);
    }
  };

  const calculateCrossRates = (initialRates) => {
    const { RUB_CUPCAKE, USD_CUPCAKE, EUR_CUPCAKE } = initialRates;

    return {
      ...initialRates,
      RUB_USD: {
        first: (RUB_CUPCAKE.first / USD_CUPCAKE.first).toFixed(2),
        second: (RUB_CUPCAKE.second / USD_CUPCAKE.second).toFixed(2),
        third: (RUB_CUPCAKE.third / USD_CUPCAKE.third).toFixed(2),
      },
      RUB_EUR: {
        first: (RUB_CUPCAKE.first / EUR_CUPCAKE.first).toFixed(2),
        second: (RUB_CUPCAKE.second / EUR_CUPCAKE.second).toFixed(2),
        third: (RUB_CUPCAKE.third / EUR_CUPCAKE.third).toFixed(2),
      },
      EUR_USD: {
        first: (EUR_CUPCAKE.first / USD_CUPCAKE.first).toFixed(2),
        second: (EUR_CUPCAKE.second / USD_CUPCAKE.second).toFixed(2),
        third: (EUR_CUPCAKE.third / USD_CUPCAKE.third).toFixed(2),
      },
    };
  };

  const pollRates = useCallback(async () => {
    try {
      const [firstResponse, secondResponse, thirdResponse] = await Promise.all([
        fetch(`${BASE_URL}/first/poll`),
        fetch(`${BASE_URL}/second/poll`),
        fetch(`${BASE_URL}/third/poll`),
      ]);

      const [firstData, secondData, thirdData] = await Promise.all([
        firstResponse.json(),
        secondResponse.json(),
        thirdResponse.json(),
      ]);

      const initialRates = {
        RUB_CUPCAKE: {
          first: firstData.rates["RUB"].toFixed(2),
          second: secondData.rates["RUB"].toFixed(2),
          third: thirdData.rates["RUB"].toFixed(2),
        },
        USD_CUPCAKE: {
          first: firstData.rates["USD"].toFixed(2),
          second: secondData.rates["USD"].toFixed(2),
          third: thirdData.rates["USD"].toFixed(2),
        },
        EUR_CUPCAKE: {
          first: firstData.rates["EUR"].toFixed(2),
          second: secondData.rates["EUR"].toFixed(2),
          third: thirdData.rates["EUR"].toFixed(2),
        },
      };

      const calculatedRates = calculateCrossRates(initialRates);
      setRates(calculatedRates);
    } catch (error) {
      console.error("Error polling rates", error);
    }
  }, []);

  useEffect(() => {
    fetchInitialRates();
    pollRates();
  }, [pollRates]);

  const findLowestRate = (rate) => {
    console.log(rate);
    return Math.min(rate.first, rate.second, rate.third);
  };

  const renderRate = (rate) => {
    console.log(rate);
    const lowestRate = findLowestRate(rate);
    console.log(lowestRate);
    return (
      <>
        <td className={rate.first == lowestRate ? "highlighted" : ""}>
          {rate.first}
        </td>
        <td className={rate.second == lowestRate ? "highlighted" : ""}>
          {rate.second}
        </td>
        <td className={rate.third == lowestRate ? "highlighted" : ""}>
          {rate.third}
        </td>
      </>
    );
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Pair name/market</th>
          <th>First</th>
          <th>Second</th>
          <th>Third</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>RUB/CUPCAKE</td>
          {renderRate(rates.RUB_CUPCAKE)}
        </tr>
        <tr>
          <td>USD/CUPCAKE</td>
          {renderRate(rates.USD_CUPCAKE)}
        </tr>
        <tr>
          <td>EUR/CUPCAKE</td>
          {renderRate(rates.EUR_CUPCAKE)}
        </tr>
        <tr>
          <td>RUB/USD</td>
          {renderRate(rates.RUB_USD)}
        </tr>
        <tr>
          <td>RUB/EUR</td>
          {renderRate(rates.RUB_EUR)}
        </tr>
        <tr>
          <td>EUR/USD</td>
          {renderRate(rates.EUR_USD)}
        </tr>
      </tbody>
    </table>
  );
};

export default CurrencyTable;
