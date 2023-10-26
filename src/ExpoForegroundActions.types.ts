export type ExpireEventPayload = {
  remaining: number;
};

export interface AndroidSettings {
  headlessTaskName: string;
  notificationTitle: string;
  notificationDesc: string;
  notificationColor: string;
  notificationIconName: string;
  notificationIconType: string;
  notificationProgress: number;
  notificationMaxProgress: number;
  notificationIndeterminate: boolean;
  linkingURI: string;
}

export interface Settings {
  events?: {
    onIdentifier?: (identifier: number) => void;
  }
  runInJS?: boolean,
}

export interface ForegroundApi {
  headlessTaskName: string;
  identifier: number;
}

export type ForegroundAction<Params> = (params: Params, api: ForegroundApi) => Promise<void>;
