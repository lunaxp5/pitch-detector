/**
 * Author:Jose Luna
 * email: lunaxp5@gmail.com
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {PitchDetector} from 'react-native-pitch-detector';
import {LineChart, Grid} from 'react-native-svg-charts';

function App(): JSX.Element {
  const [data, setData] = useState({tone: '', frequency: 0});
  const [isRecording, setIsRecording] = useState(false);
  const dataArray = useRef(new Array(100).fill(undefined));

  dataArray.current.push(
    data?.frequency === 0 ? undefined : Number(data?.frequency?.toFixed(1)),
  );
  dataArray.current.shift();

  const onStart = async () => {
    await PitchDetector.start();
    setIsRecording(true);
  };

  const onStop = async () => {
    await PitchDetector.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    const subscription = PitchDetector.addListener(e => {
      console.log(e);
      setData(e);
    });

    return () => {
      PitchDetector.removeListener(subscription);
      onStop();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        console.log(data);
        setData({tone: '', frequency: 0});
      }, 50);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isRecording, data]);

  return (
    <SafeAreaView style={styles.Wrapper}>
      <View style={styles.content}>
        <View style={styles.chart}>
          <LineChart
            style={styles.chart}
            data={dataArray.current}
            svg={{stroke: '#E50914'}}
            yMin={100}
            yMax={250}
            contentInset={{top: 20, bottom: 20}}>
            <Grid />
          </LineChart>
        </View>
        <View style={styles.wrapperTone}>
          <Text style={styles.textTone}>{data.tone}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => (isRecording ? onStop() : onStart())}>
          <Text style={styles.textBtn}>{isRecording ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Wrapper: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 20,
    flexDirection: 'column',
  },
  chart: {
    flex: 1,
  },
  wrapperTone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTone: {
    fontSize: 60,
    color: '#FFFFFF',
  },
  text: {
    color: '#FFFFFF',
  },
  btn: {
    backgroundColor: '#E50914',
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBtn: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
