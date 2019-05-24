import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ImageBackground,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import moment from 'moment'

const APP_ID = '59c54241464d4715efbdff33fde905c1';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&mode=json&APPID=' + APP_ID;

// const delay = (result) => new Promise(resolve => setTimeout(() => resolve(result), 2000))
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      weather: null,
      loading: false,
    };
  }
  dohvatiVreme() {

    // postavljanje loading flaga na true
    this.setState({ loading: true });

    // saljemo zahtev ka API-u
    fetch(`${BASE_URL}&q=${this.state.city}`)
      .then((res) => res.json())
      .then(result => {
        console.log('result', result);
        // kada dobijemo rezultat sa servera
        // poziva se ova funkcija
        // u kojoj obradjujemo zahtev

        // ako temperatura nije pronadjena prikazujemo gresku sa servera
        // ili Something went wrong
        if (!result.main || typeof result.main.temp === 'undefined') {
          if (result.message) {
            Alert.alert(result.message);
          } else {
            Alert.alert('Something went wrong');
          }
          // stavljamo flag loading na false
          // samim tim skrivamo loading indikator
          this.setState({ loading: false });
          return;
        }

        // updejtujemo stanje aplikacije
        // weather state cuva temperaturu
        // trenutni grad i status
        this.setState({
          loading: false,
          weather: {
            temp: result.main.temp,
            city: result.name,
            status: result.weather[0].description,
          },
        })
      }).catch((error) => {
        // ako server nije dostupan poziva se ova metoda
        Alert.alert(error.message);
      })
  }
  render() {
    return (
      <ImageBackground
        source={require('./assets/indjija.jpg')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          {this.state.loading ? <ActivityIndicator // ako je loading true prikazujemo loading indikator
            size="large"
            color="#ffffff"
          /> : null}
          {this.state.weather ? <View // prikaz trenutnog vremena ako je dostupno
            style={{ alignItems: 'center', marginBottom: 10 }}
          >
            <Image source={require('./assets/sun.png')} />
            <Text style={styles.name}>{this.state.weather.city}</Text>
            <Text style={styles.type}>{this.state.weather.status}</Text>
            <Text style={styles.temp}>{this.state.weather.temp} °C</Text>
          </View> : null}
          <TextInput
            onChangeText={(text) => { // funkcija koja se poziva kad se text promeni
              // updejtujemo vrednost grada u state-u
              this.setState({
                city: text,
              })
            }}
            value={this.state.city} // postavljanje vrednosti inputa
            style={{ backgroundColor: 'white', width: 100 }}
          />
          <Button
            title="Pretrazi Grad"
            onPress={() => { // poziva se kada korisnik klikne na dugme
              this.dohvatiVreme();
            }}
            color="#fff"
          />
          <Text style={styles.updateTime}>
            Vreme ažuriranja 12:00:00
          </Text>
        </View>
      </ImageBackground>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  name: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  type: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 5,
  },
  temp: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  updateTime: {
    color: '#fff',
    fontSize: 14,
  }
});