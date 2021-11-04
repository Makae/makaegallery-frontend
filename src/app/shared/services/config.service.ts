import {ConfigModel} from '../models/config-model';
import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configProperty!: ConfigModel;

  public get config(): ConfigModel {
    return environment;
  }

  public set config(value: ConfigModel) {
    this.configProperty = value;
  }
}
