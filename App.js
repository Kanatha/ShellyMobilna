import { StyleSheet, Text, View, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useState } from "react";

export default function App() {
  async function getApiData() {
    try {
      const response = await fetch("http://192.168.1.162:3000/status");
      const res = await response.json();

      return [res.power, res.tarifa];
    } catch (err) {
      console.warn(err);

      return "failed to fetch";
    }
  }

  async function getTableData() {
    try {
      const res = await fetch("http://192.168.1.162:3000/data");
      const dataR = await res.json();

      return dataR;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  const [apower, setApower] = useState("fetching...");
  const [dataW, setDataW] = useState([]);
  const [dataT, setDataT] = useState(0);
  const [dataO, setDataO] = useState([]);
  const [skupno, setSkupno] = useState([]);

  setInterval(async () => {
    [power, tarifa] = await getApiData();
    setApower(power);

    const tableData = await getTableData();
    const arrayW = [];
    const arrayO = [];
    const skupno1 = [];

    tableData.forEach((item) => {
      arrayW.push({ value: parseFloat(item.moc) });
      arrayO.push({ value: (item.moc / 1000) * item.tarifa });
      skupno1.push((item.moc / 1000) * item.tarifa);
    });
    setDataW(arrayW);
    setDataT(tarifa);
    setDataO(arrayO);
    setSkupno(skupno1);
  }, 5000);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Trenutna poraba: {apower} W</Text>
        <Text>Trenutna tarifa: {dataT} €/kWh</Text>
        <Text>Trenutna cena omreznine: {(apower / 1000) * dataT} €/kWh</Text>
        <Text>
          skupna cena omrežnine{" "}
          {skupno.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          )}
          {"€ "}
        </Text>
        <LineChart
          data={dataW}
          initialSpacing={10}
          spacing={10}
          hideDataPoints
          color="#00FF05"
        />
        <Text>Poraba v W</Text>
        <LineChart
          data={dataO}
          initialSpacing={10}
          spacing={10}
          hideDataPoints
          color="#0000AA"
        />
        <Text>Cena omreznine</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
