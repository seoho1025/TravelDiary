// 인기 일기 페이지
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomBoldText from "../../components/CustomBoldText";
import CustomText from "../../components/CustomText";

const bestDiaries = [
  {
    id: 1,
    image: require("../../assets/images/best1.jpg"),
    author: "여행자",
    profile: require("../../assets/images/profile1.jpg"),
    content: "님펜부르크 성은 고풍스러운 바양식의 건축물이 인상적이었다.",
    tags: ["#유럽여행", "+3"],
    likes: 55,
  },
  {
    id: 2,
    image: require("../../assets/images/best2.jpg"),
    author: "여행자 2",
    profile: require("../../assets/images/profile2.png"),
    content: "님펜부르크 성은 고풍스러운 바양식의 건축물이 인상적이었다.",
    tags: ["#독일여행", "+5"],
    likes: 12,
  },
];

const randomDiaries = [
  {
    id: 5,
    image: require("../../assets/images/random1.jpg"),
    author: "랜덤러버",
    profile: require("../../assets/images/profile3.jpg"),
    content: "랜덤으로 뽑힌 여행일기!",
    tags: ["#랜덤", "#여행"],
    likes: 17,
  },
  {
    id: 6,
    image: require("../../assets/images/random2.jpeg"),
    author: "랜덤여행자",
    profile: require("../../assets/images/profile4.png"),
    content: "이런 여행도 있었네!",
    tags: ["#랜덤", "#발견"],
    likes: 9,
  },
];

const europeDiaries = [
  {
    id: 3,
    image: require("../../assets/images/europe1.jpg"),
    author: "유럽러버",
    profile: require("../../assets/images/profile5.jpg"),
    content: "유럽의 골목길을 걷는 기분이 최고였다!",
    tags: ["#유럽여행", "#골목길"],
    likes: 33,
  },
  {
    id: 4,
    image: require("../../assets/images/europe2.jpg"),
    author: "파리여행자",
    profile: require("../../assets/images/profile6.png"),
    content: "에펠탑 야경은 정말 잊을 수 없다.",
    tags: ["#유럽여행", "#파리"],
    likes: 21,
  },
];

export default function PopularDiaryScreen() {
  const [filter, setFilter] = useState("random");
  const filteredDiaries = filter === "random" ? randomDiaries : europeDiaries;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 위쪽: 오늘의 베스트 */}
        <CustomBoldText style={styles.sectionTitle}>오늘의 베스트</CustomBoldText>
        <CustomBoldText style={styles.sectionTitle2}>여행일기</CustomBoldText>
        <View style={styles.bestRow}>
          {bestDiaries.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.likeRow}>
                <Ionicons name="heart" size={16} color="#F04438" />
                <CustomText style={styles.likeText}>{item.likes}</CustomText>
              </View>
              <View style={styles.cardContentWrap}>
                <View style={styles.profileRow}>
                  <Image source={item.profile} style={styles.profileImg} />
                  <CustomText style={styles.profileName}>{item.author}</CustomText>
                </View>
                <CustomText style={styles.cardContent}>{item.content}</CustomText>
                <View style={styles.tagRow}>
                  {item.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tag}>
                      <CustomText style={styles.tagText}>{tag}</CustomText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 아래쪽: 주제별로 모아보는 */}
        <CustomBoldText style={styles.sectionTitle}>주제별로 모아보는</CustomBoldText>
        <CustomBoldText style={styles.sectionTitle2}>인기 여행일기</CustomBoldText>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={filter === "random" ? styles.filterBtnActive : styles.filterBtn}
            onPress={() => setFilter("random")}
          >
            <CustomText style={filter === "random" ? styles.filterBtnTextActive : styles.filterBtnText}>
              그냥 랜덤으로 볼래요!
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={filter === "europe" ? styles.filterBtnActive : styles.filterBtn}
            onPress={() => setFilter("europe")}
          >
            <CustomText style={filter === "europe" ? styles.filterBtnTextActive : styles.filterBtnText}>
              #유럽 여행
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.bestRow}>
          {filteredDiaries.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.likeRow}>
                <Ionicons name="heart" size={16} color="#F04438" />
                <CustomText style={styles.likeText}>{item.likes}</CustomText>
              </View>
              <View style={styles.cardContentWrap}>
                <View style={styles.profileRow}>
                  <Image source={item.profile} style={styles.profileImg} />
                  <CustomText style={styles.profileName}>{item.author}</CustomText>
                </View>
                <CustomText style={styles.cardContent}>{item.content}</CustomText>
                <View style={styles.tagRow}>
                  {item.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tag}>
                      <CustomText style={styles.tagText}>{tag}</CustomText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginTop: 20,
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  bestRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    justifyContent: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 170,
    marginHorizontal: 4,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: 190,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: "cover",
  },
  likeRow: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  likeText: {
    color: "#F04438",
    fontWeight: "bold",
    marginLeft: 3,
    fontSize: 13,
  },
  cardContentWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    backgroundColor: "#eee",
  },
  profileName: {
    fontSize: 13,
    color: "#888",
    fontWeight: "bold",
  },
  cardContent: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: "row",
    marginTop: 2,
    gap: 4,
  },
  tag: {
    backgroundColor: "#F2F4F6",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginRight: 4,
  },
  tagText: {
    fontSize: 11,
    color: "#4263EB",
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  filterBtnActive: {
    backgroundColor: "#4263EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterBtn: {
    backgroundColor: "#F2F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterBtnTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  filterBtnText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 13,
  },
});