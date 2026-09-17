import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@screens/LoginScreen';
import RegisterScreen from '@screens/RegisterScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthStackNavigatorProps {
  onLoginSuccess: (token: string) => void;
}

/**
 * AuthStackNavigator: Quản lý luồng chuyển đổi giữa Login và Register
 * Khi đăng nhập / đăng ký thành công, sẽ chuyển State lên App.tsx
 */
export const AuthStackNavigator: React.FC<AuthStackNavigatorProps> = ({ onLoginSuccess }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            onLogin={onLoginSuccess}
            onGoRegister={() => navigation.navigate('Register')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {({ navigation }) => (
          <RegisterScreen
            onRegistered={onLoginSuccess}
            onGoLogin={() => navigation.navigate('Login')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
