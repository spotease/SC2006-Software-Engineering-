import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';

export default function searchHistory() {
  const historyData = [
    {
      date: '28/02/2025',
      entries: [
        { time: '10:34', location: 'DBS Bank Takashimaya', type: 'Home' },
        { time: '18:50', location: '', type: '' },
      ],
    },
    {
      date: '27/02/2025',
      entries: [
        { time: '10:01', location: 'Botanic Gardens', type: 'Home' },
        { time: '13:20', location: '', type: '' },
        { time: '15:37', location: "Mom's Home", type: 'Home' },
        { time: '20:21', location: '', type: '' },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        History
      </Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.date}</Text>
            {item.entries.map((entry, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ color: 'white', fontSize: 16 }}>{entry.time}</Text>
                <Text style={{ color: 'gray', fontSize: 16 }}>{entry.location}</Text>
                <Text style={{ color: 'gray', fontSize: 16 }}>{entry.type}</Text>
              </View>
            ))}
          </View>
        )}
      />
      <TouchableOpacity
        style={{ backgroundColor: '#008080', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}
