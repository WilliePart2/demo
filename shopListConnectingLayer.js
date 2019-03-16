let mapStateToProps = (state, props) => {
  let shopList = state.market.shopList;

  return {
    ...props,
    shopList
  };
};

let mapDispatchToProps = dispatch => {
  return {
    getShopList: (
      pageNumber,
      searchInput,
      count = AppConfig.DATA_LIST_SIZE
    ) => {
      if (!searchInput) {
        return dispatch(getShopsList(pageNumber, count));
      }
      return dispatch();
    },

    confirmShop: shopId => {
      return dispatch(confirmMarket(TMarketTypes.SHOP, shopId));
    },

    declineShop: shopId => {
      return dispatch(declineMarket(TMarketTypes.SHOP, shopId));
    }
  };
};

let ConnectedShopList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopListContainer);

export { ConnectedShopList };

