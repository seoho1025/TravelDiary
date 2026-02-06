import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PopularDiaryScreen from "../sharing_diary/popular-dummy";
import RealtimeDiaryScreen from "../sharing_diary/realtime";

export default function FeedTabScreen() {
  const [tab, setTab] = useState("popular-dummy");
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단 헤더 */}
      <View style={styles.headerCenter}>
        <Text style={styles.title}>TRAVEL DIARY</Text>
      </View>

      {/* 탭바 */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setTab("popular-dummy")} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === "popular-dummy" && styles.tabTextActive]}>인기</Text>
          {tab === "popular-dummy" && <View style={styles.underline} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("realtime")} style={styles.tabBtn}>
          <Text style={[styles.tabText, tab === "realtime" && styles.tabTextActive]}>실시간</Text>
          {tab === "realtime" && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      {/* 탭 내용 */}
      <View style={{ flex: 1 }}>
        {tab === "popular-dummy" ? (
          <PopularDiaryScreen />
        ) : (
          <RealtimeDiaryScreen />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4263EB",
    textAlign: "center",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#bbb",
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#222",
  },
  underline: {
    marginTop: 2,
    height: 2,
    width: 24,
    backgroundColor: "#4263EB",
    borderRadius: 1,
  },
});