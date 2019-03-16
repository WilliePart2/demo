export class ShopList extends React.Component {
  static propTypes = {
    getShopList: PropTypes.func.isRequired,
    shopList: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
    itemsReserve: PropTypes.number.isRequired,
    onEditShopInfo: PropTypes.func.isRequired,
    onGetShopInfo: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isFirstRender: true,
      hasError: false,
      errorMessage: ''
    };
  }

  _reportError(errorMessage) {
    this.setState({
      errorMessage,
      hasError: true
    });
  }

  _resetError() {
    this.setState({
      hasError: false,
      errorMessage: ''
    });
  }

  static getDerivedStateFromProps(newProps, prevState) {
    let { getShopList } = newProps;
    let { isFirstRender } = prevState;

    if (isFirstRender) {
      getShopList(0);

      return {
        isFirstRender: false
      };
    }

    return null;
  }

  _getData() {
    let { shopList } = this.props;
    return shopList.map(marketDataObj => {
      return {
        name: marketDataObj.name,
        activeItems: marketDataObj.activeItems,
        pohOrders: marketDataObj.pohOrders,
        onlineOrders: marketDataObj.onlineOrders,
        onlineSales: marketDataObj.onlineSales,
        status: marketDataObj.status.description,
        dateAdded: marketDataObj.date,
        action: '-'
      };
    });
  }

  _getColumns() {
    return [
      makeHeaderDef('Shop name', 'name'),
      makeHeaderDef('Active items', 'activeItems'),
      makeHeaderDef('POH orders', 'pohOrders'),
      makeHeaderDef('Online orders', 'onlineOrders'),
      makeHeaderDef('Online sales', 'onlineSales'),
      makeHeaderDef('Status', 'status'),
      makeHeaderDef('Date added', 'dateAdded'),
      {
        Header: 'Action',
        accessor: 'action',
        Cell: rowInfo => {
          return (
            <Grid container row fullHeight fullWidth justify="space-around">
              <IconButton
                Icon={ViewIcon}
                onClick={() =>
                  this.props.onGetShopInfo(this.props.shopList[rowInfo.index])
                }
              />
              <IconButton
                Icon={EditIcon}
                onClick={() => {
                  this.props.onEditShopInfo(this.props.shopList[rowInfo.index]);
                }}
              />
            </Grid>
          );
        }
      }
    ];
  }

  getShopList = async pageNumber => {
    let { getShopList } = this.props;
    return getShopList(pageNumber);
  };

  onError = () => {
    this._reportError(
      'Error occur while try to fetch shop list please try again later'
    );
  };

  render() {
    let { pageSize, itemsReserve } = this.props;
    if (this.state.hasError) {
      return (
        <Message error visible={this.state.hasError}>
          {this.state.errorMessage}
        </Message>
      );
    }

    return (
      <TableList
        data={this._getData()}
        columns={this._getColumns()}
        pageSize={pageSize}
        itemsReserve={itemsReserve}
        onNext={this.getShopList}
        onPrev={this.getShopList}
        onError={this.onError}
      />
    );
  }
}
