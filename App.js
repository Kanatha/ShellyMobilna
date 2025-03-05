import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

import { useEffect, useState } from 'react';

async function getWattage(){

  const response = await fetch("http://192.168.1.162:3000/status");
  const data = await response.json()
  console.log(data.apower)

  return(data.apower)

}




export default function App() {

  const [apower, setApower] = useState(1);

  useEffect(() => {
    setInterval(async () => {

      wattage = getWattage()
      console.log(wattage)
      setApower(wattage)

    }, 1000)
  });

  return (
    <View style={styles.container}>
      
      <Text>{apower} W</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
