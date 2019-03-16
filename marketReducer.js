export function marketsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_MARKET_OBJECT:
      return {
        ...state,
        ownMarket: {
          ...action.payload
        },
        isMarketFetched: true
      };
    case UPDATE_MARKET_DATA:
      let finalObj = { ...state };
      let { description, businessName } = action.payload;
      if (description) {
        finalObj = {
          ...finalObj,
          description
        };
      }
      if (businessName) {
        finalObj = {
          ...finalObj,
          businessName
        };
      }

      return finalObj;
    case SET_MARKET_SHOP_LIST:
      return {
        ...state,
        shopList: getUniqueMarketList([...state.shopList, ...action.payload])
      };
    case SET_MARKET_AS_CONFIRMED: {
      let { type, marketId } = action.payload;
      let updatedState = {
        shopList: [...state.shopList],
        tailorsList: [...state.tailorsList],
        stylistsList: [...state.stylistsList]
      };
      let fieldName = getFieldNameByType(type);

      updatedState[fieldName] = updatedState[fieldName].map(market => {
        if (market.marketId === marketId) {
          let updatedEnhancement = market.enhancement.filter(
            enhancement => !detectMarketStateEnhancement(enhancement)
          );
          updatedEnhancement.push(TMarketEnhancement.CONFIRMED);

          return {
            ...market,
            enhancement: updatedEnhancement,
            status: getMarketEnhancement(updatedEnhancement)
          };
        }
        return market;
      });

      return {
        ...state,
        ...updatedState
      };
    }
    case SET_MARKET_AS_DECLINED: {
      let { type, marketId } = action.payload;
      let fieldName = getFieldNameByType(type);

      return {
        ...state,
        [fieldName]: state[fieldName].map(marketObj => {
          if (marketObj.marketId === marketId) {
            let newEnhancement = marketObj.enhancement.filter(
              enhancement => !detectMarketStateEnhancement(enhancement)
            );
            newEnhancement.push(TMarketEnhancement.DECLINED);

            return {
              ...marketObj,
              enhancement: newEnhancement,
              status: getMarketEnhancement(newEnhancement)
            };
          }

          return marketObj;
        })
      };
    }
    default:
      return state;
  }
}
