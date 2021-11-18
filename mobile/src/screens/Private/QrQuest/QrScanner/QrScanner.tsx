import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

export const QrScanner = () => {
  const navigation = useNavigation();
  const onSuccess = (e: BarCodeReadEvent) => {
    navigation.navigate('question', { questionId: e.data });
  };
  return (
    <QRCodeScanner
      onRead={onSuccess}
      reactivate={true}
      reactivateTimeout={1000}
      showMarker={true}
      cameraProps={{ flashMode: 'auto' }}
      cameraStyle={{ height: '100%' }}
    />
  );
};
