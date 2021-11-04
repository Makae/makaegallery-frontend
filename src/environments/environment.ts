import {ConfigModel} from "../app/shared/models/config-model";
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.

export const environment: ConfigModel = {
  production: false,
  backendUrl: 'http://localhost:80/makaegallery/api'
};

