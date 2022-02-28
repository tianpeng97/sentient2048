class Cell extends React.Component {
  render() {
    return (
      <td
        style={{
          width: `${100 / this.props.size}%`,
          height: `${100 / this.props.size}%`,
        }}
        className={`board-cell value-${this.props.value}`}
      >
        {this.props.value}
      </td>
    );
  }
}
