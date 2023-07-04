import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { DataTable } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const Appointment = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [CComplaint, setCComplaint] = useState("");
    const [HighBP, setHighBP] = useState("");
    const [LowBP, setLowBP] = useState("");
    const [Temperature, setTemperature] = useState("");
    const [Sugar, setSugar] = useState("");
    const [Dname, setDname] = useState("");
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const route = useRoute();
    const { doctordb,Aid,DrName,name } = route.params;
    useEffect(() => {
      const apiUrl = `http://${ip}/DoctorApi/api/Doctor/DocDash?doctordb=${doctordb}`;
  
      
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
         .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          
          throw new Error('Network response was not ok.');
        }
      })
      .then((data) => {
        console.log(data);
        setDname(data.Name);
        
      
      })
        .catch((error) => {
          console.error('Error:', error);
        });
    },[doctordb]);
    
    useEffect(() => {
      const fetchRxData = async () => {
        try {
          const apiUrl = `http://${ip}/DoctorApi/api/Doctor/RxData?doctordb=${doctordb}&Aid=${Aid}`;
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            setData(data);
            //setMedicines( data.PrescriptionData.map((medicine) => ` ${medicine}`)); 
            setPrescriptionData(data.PrescriptionData);
            setCComplaint(data.CComplaint);
            setHighBP(data.VitalsData.High_BP);
            setLowBP(data.VitalsData.Low_BP);
            setTemperature(data.VitalsData.Temperature);
            setSugar(data.VitalsData.SugarLevel);
console.log(LowBP);
          } else {
            throw new Error('Network response was not ok.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchRxData();
    }, []);
    const sendResponse = async () => {
      const data = {
        Name: DrName,
        Dname: Dname,
        PName: name,
        CComplaint: CComplaint,
        HighBP: HighBP,
        LowBP: LowBP,
        Temperature: Temperature,
        Sugar: Sugar,
        Medicines: prescriptionData.map((medicine) => ({
          MNme: medicine,
        }))
      };
    
      try {
        const apiUrl = `http://${ip}/DoctorApi/api/Doctor/SendResponse`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          // Handle successful response
          Alert.alert('Response Sent', 'Response has been successfully sent.');
          console.log(data);
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred while sending the response. Please try again.');
        console.log(data);
      }
    };
    
  
    return (
      <ScrollView style={styles.container}>
        <View style={styles.flex1}>
          {/*Doctor image */}
          <Image style={styles.imagess} source={require('../image/Pharmacy.png')} />
        </View>
  
        <View>
          <Text style={styles.Text3}>Chief Complaint: {data ? data.CComplaint : ''}</Text>
        </View>
        <View>
          <Text style={styles.Text2}>Vitals</Text>
          <Text style={styles.Text3}>High Blood Pressure: {data ? data.VitalsData.High_BP : 0}</Text>
          <Text style={styles.Text3}>Low Blood Pressure: {data ? data.VitalsData.Low_BP : 0}</Text>
          <Text style={styles.Text3}>Temperature: {data ? data.VitalsData.Temperature : 0}</Text>
          <Text style={styles.Text3}>Sugar Level: {data ? data.VitalsData.SugarLevel : 0}</Text>
        </View>
        <View>
  <Text style={styles.Text2}>Medicines:</Text>
  {data ? (
    data.PrescriptionData.map((medicine, index) => (
      <Text key={index} style={styles.Text4}>
        {`${index + 1}. ${medicine}`}
      </Text>
    ))
  ) : (
    <Text>No prescription data available</Text>
  )}
</View>
<View>
<TouchableOpacity
            style={styles.button}
            onPress={sendResponse}
          >
            <Text style={styles.Text4}>Send</Text>
          </TouchableOpacity>
</View>
      </ScrollView>
    );
  };
  
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A4E5EE',
  },
  flex1: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#398AA4',
  },
  flex2: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#8cdbe6',
  },
  imagess: {
    height: 220,
    width: 220,
    alignItems: 'center',
  },
  Textheader: {
    paddingTop: 12,
    fontSize: 25,
    color: '#000000',
    textAlign: 'center',
  },
  Text2: {
    padding: 10,
    fontSize: 35,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  Text3: {
    padding: 12,
    fontSize: 22,
    color: '#000',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  input: {
    height:55,
    margin:15,
    borderWidth: 2,
    borderColor:'#000000', 
    width: "60%",
      borderRadius: 40, 
      padding:20,
      
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    color: '#000000',
    fontWeight: 'bold',
  },

  button: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    backgroundColor: '#efff',
    padding: 15,
    borderRadius: 30,
    margin:30,
    //marginTop: 30,
   // fontSize: 18,
    width: '32%',
  },
  button1: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    backgroundColor: '#17725C',
    padding: 15,
    borderRadius: 15,
    margin: 10,
    marginTop: 60,
   // fontSize: 18,
    width: '45%',
  },
  link1: {
    fontSize: 15,
    color: '#ff0000',
    textAlign: 'right',
    margin: 8,
  },
  Bview:{
   // borderWidth: 1,
    flexDirection: 'row',
    justifyContent:'space-evenly',
    // flexWrap: 'nowrap',
    alignItems:'stretch',
    margin:12,
    

  },
  imagess: {
    height: 220,
    width: 220,
    alignItems: 'center',
  },
  loginb:{
    // borderWidth: 1,
     flexDirection: 'row',
     justifyContent:'flex-end',
     // flexWrap: 'nowrap',
     //alignItems:'right',
     margin:12,
 
   },
   rolebutton:{
    alignItems: "center",
backgroundColor: "#efff",
padding:1,
 borderRadius:25, 
 margin: 1,
 fontSize:10,
 width: "30%",
  },

  
row:{
  flexDirection:'row',
  alignItems: 'center',
  justifyContent: 'center',
},
Text4: {
    padding: 8,
    fontSize: 17,
    color: '#000',
    textAlign: 'left',
    //fontWeight: 'bold',
  },
});
export default Appointment;
