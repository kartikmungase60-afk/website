export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface UIConfig {
  loading: {
    enableLoadingScreen: boolean;
    loadingDuration: number;
  };
  currency: {
    defaultCurrency: string;
    supportedCurrencies: Currency[];
  };
}
