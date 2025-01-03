/*eslint sort-keys: ["error", "asc", {caseSensitive: false}]*/
export const RouteKeys = {
  AppVersion: 'app-version',
  Document: 'document',
  Index: '/',
  Login: 'login',
  Manual: 'manual',
  Member: 'member',
  Menu: 'menu',
  Order: 'order',
  Policy: 'policy',
  Register: 'register',
  Settlement: 'settlement',
  Shop: 'shop',
  ShopId: 'shop-id'
}

export const Routes = {
  AppVersion: `/${RouteKeys.AppVersion}`,
  Home: '/',
  Login: `/${RouteKeys.Login}`,
  Member: `/${RouteKeys.Member}`,
  Menu: `/${RouteKeys.Menu}`,
  Order: {
    Document: `/${RouteKeys.Order}/${RouteKeys.Document}`,
    List: `/${RouteKeys.Order}`,
    Manual: `/${RouteKeys.Order}/${RouteKeys.Manual}`
  },
  Policy: `/${RouteKeys.Policy}`,
  Settlement: `/${RouteKeys.Settlement}`,
  Shop: {
    Detail: `/${RouteKeys.Shop}/[${RouteKeys.ShopId}]`,
    List: `/${RouteKeys.Shop}`,
    Register: `/${RouteKeys.Shop}/${RouteKeys.Register}`
  }
}
