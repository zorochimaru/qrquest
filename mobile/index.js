/**
 * @format
 */

import { AppRegistry } from 'react-native';
import AppWithStore from './src/AppWithStore';
import { name as appName } from './src/app.json';

AppRegistry.registerComponent(appName, () => AppWithStore);
