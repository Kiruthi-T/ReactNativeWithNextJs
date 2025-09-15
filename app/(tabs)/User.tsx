import React, { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert
} from 'react-native'
import Toast from 'react-native-toast-message'
import { Feather, FontAwesome } from '@expo/vector-icons'
import Api from '../../services/Api'
import axios from 'axios'

interface User {
  _id: string;
  name: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function UserManagement() {
  const [data, setData] = useState({ _id: "", name: "", age: 0 })
  const [userList, setUserList] = useState<User[]>([])
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    try {
      const res = await axios.get("http://192.168.29.135:3000/api/user")
      setUserList(res.data)
    }
    catch (error) {
      console.error(error)
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch users'
      })
    }
  }

  const createUser = async () => {
    try {
      const res = await Api.post("/user", data);
      getUser()
      reset()
      Toast.show({
        type: 'success',
        text1: 'User created successfully'
      })
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to create user'
      })
    }
  };

  const updateuser = async () => {
    try {
      await Api.put(`/user/${data._id}`, { name: data.name, age: data.age });
      getUser()
      reset()
      setIsEditing(false)
      Toast.show({
        type: 'success',
        text1: 'User updated successfully'
      })
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to update user'
      })
    }
  };

  const deleteUser = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await Api.delete(`/user/${id}`);
              getUser()
              Toast.show({
                type: 'success',
                text1: 'User deleted successfully'
              })
            } catch (error) {
              console.error(error);
              Toast.show({
                type: 'error',
                text1: 'Failed to delete user'
              })
            }
          }
        }
      ]
    )
  };

  const reset = () => {
    setData({ _id: "", name: "", age: 0 })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
      </View>

      <Toast />
      
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isEditing ? "Update user" : "Create user"}
          </Text>
          <TextInput
            style={styles.input}
            value={data.name}
            onChangeText={(text) => setData({ ...data, name: text })}
            placeholder="Enter your name"
          />
          <TextInput
            style={styles.input}
            value={data.age.toString()}
            onChangeText={(text) => setData({ ...data, age: Number(text) || 0 })}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            {!isEditing ? (
              <TouchableOpacity
                onPress={createUser}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={updateuser}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => { reset(); setIsEditing(false); }}
                  style={styles.button}
                >
                  <Feather name="x" size={20} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView style={styles.listContainer}>
          <View style={styles.userGrid}>
            {userList.map((user) => (
              <View key={user._id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text>Age: {user.age}</Text>
                  <Text>
                    Created At: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </Text>
                </View>
                <View style={styles.userActions}>
                  <TouchableOpacity 
                    onPress={() => { setData(user); setIsEditing(true); }}
                    style={styles.iconButton}
                  >
                    <FontAwesome name="edit" size={20} color="#6b46c1" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => deleteUser(user._id)}
                    style={styles.iconButton}
                  >
                    <Feather name="trash-2" size={20} color="#e53e3e" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf5ff',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b46c1',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  formContainer: {
    backgroundColor: '#fffbeb',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  formTitle: {
    textAlign: 'center',
    color: '#6b46c1',
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd6fe',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#6b46c1',
    padding: 12,
    borderRadius: 6,
    margin: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  userGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userCard: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#6b46c1',
    fontSize: 16,
    marginBottom: 4,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
})