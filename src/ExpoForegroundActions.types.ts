
export type ExpireEventPayload = {
  remaining: number;
};

export interface ExpoForegroundOptions {
  headlessTaskName: string;
  notificationTitle: string;
  notificationDesc: string;
  notificationColor: string;
  notificationIconName: string;
  notificationIconType: string;
  notificationProgress: number;
  notificationMaxProgress: number;
  notificationIndeterminate: boolean;
  runInJS?: boolean;
  onStart?: (identifier:number) => void;
}

export interface ForegroundApi {
  headlessTaskName: string;
}
export type ForegroundAction<Params> = (params: Params, api: ForegroundApi) => Promise<void>;
