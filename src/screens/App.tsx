import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SplashScreen from 'expo-splash-screen'
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider
} from 'react-native-paper'
import navigations from '@/navigators/index'

const Stack = createNativeStackNavigator()
SplashScreen.preventAutoHideAsync()

setTimeout(() => {
  SplashScreen.hideAsync()
}, 3000)

const theme = {
  ...DefaultTheme
}

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          {navigations.map(item => (
            <Stack.Screen
              key={item.key}
              name={item.name}
              component={item.screen}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App
