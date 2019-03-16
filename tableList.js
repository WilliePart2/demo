/**
 * onNext/onPrev - need to pass method which return promise
 * onError - will invoked if error occur
 */
export class TableList extends React.Component {
  _page = 0;

  get page() {
    return this._page;
  }

  set page(value) {
    this._page = value;
  }

  static propTypes = {
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onRowClick: PropTypes.func,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
    itemsReserve: PropTypes.number
  };

  static defaultProps = {
    itemsReserve: 10,
    onError: () => {},
    onRowClick: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  async _withLoading(actionFn) {
    let result;
    this.setState({ isLoading: true });
    result = await actionFn();
    this.setState({ isLoading: false });
    return result;
  }

  _checkNeedToFetchData(pageToShow) {
    let { pageSize, data, itemsReserve } = this.props,
      itemsToDisplay = pageToShow * pageSize;

    return data.length - itemsToDisplay < itemsReserve;
  }

  onPageChange = async currentPage => {
    let result;
    let action = () => {};
    let { onError } = this.props;
    if (this.page < currentPage) {
      action = () => this.props.onNext(++currentPage);
    } else {
      action = () => this.props.onPrev(++currentPage);
    }

    if (!this._checkNeedToFetchData()) {
      return;
    }

    result = await this._withLoading(action);

    if (!result) {
      onError();
    }
  };

  render() {
    let { pageSize, data, columns, onRowClick } = this.props;
    return (
      <DataTable
        columns={columns}
        data={data}
        onPageChange={this.onPageChange}
        onRowClick={onRowClick}
        loading={this.state.isLoading}
        pageSize={pageSize}
      />
    );
  }
}

