import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/CustomText';

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const router = useRouter();
  // const setImageStore = useDiaryCreateStore(state => state.setImage);
  //  const setNameStore = useDiaryCreateStore(state => state.setName);
  // const setImageBase64Store = useDiaryCreateStore(state => state.setImageBase64);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      // setImageStore(result.assets[0].uri);
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
      // setImageBase64Store(`data:image/jpeg;base64,${base64}`);
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    //setNameStore(text);
  };

  const handleCreate = () => {
    router.push('../creating_diary/select-country');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CustomText style={styles.title}>이 기록에 이름을 붙여주세요</CustomText>
          <TouchableOpacity style={styles.imageCircle} onPress={pickImage} activeOpacity={0.8}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <CustomText style={styles.imageText}>기록을 대표할 사진을{"\n"}선택해주세요</CustomText>
            )}
            <View style={styles.iconWrapper}>
              <Ionicons name="images-outline" size={22} />
            </View>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="15자 이내"
              maxLength={15}
              value={name}
              onChangeText={handleNameChange}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.buttonFixed,
            { backgroundColor: image && name ? '#3E69EE' : '#B0B8C1' }
          ]}
          onPress={handleCreate}
          disabled={!(image && name)}
        >
          <CustomText style={styles.buttonText}>생성하기</CustomText>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100, // 버튼 영역 확보
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  imageCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#6D8CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  imageText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  iconWrapper: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  input: {
    fontSize: 18,
    paddingVertical: 12,
    color: '#222',
    textAlign: 'center',
  },
  buttonFixed: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#3E69EE',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 