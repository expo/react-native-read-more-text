import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default class ReadMore extends React.Component {
  state = {
    shouldShowReadMore: false,
    showAllText: false
  };

  async componentDidMount() {
    this._isMounted = true;
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._invisibleText);

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text);

    if (fullHeight > limitedHeight) {
      this.setState({ shouldShowReadMore: true }, () => {
        this.props.onReady && this.props.onReady();
      });
    } else {
      this.props.onReady && this.props.onReady();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { showAllText } = this.state;

    let { numberOfLines } = this.props;

    return (
      <View>
        <Text
          style={styles.invisible}
          ref={text => {
            this._invisibleText = text;
          }}
        >
          {this.props.children}
        </Text>

        <Text
          numberOfLines={!showAllText ? numberOfLines : 0}
          ref={text => {
            this._text = text;
          }}
        >
          {this.props.children}
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    );
  }

  _handlePressReadMore = () => {
    this.setState({ showAllText: true });
  };

  _handlePressReadLess = () => {
    this.setState({ showAllText: false });
  };

  _maybeRenderReadMore() {
    let { shouldShowReadMore, showAllText } = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadMore}>
          Read more
        </Text>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadLess}>
          Hide
        </Text>
      );
    }
  }
}

function measureHeightAsync(component) {
  return new Promise(resolve => {
    component.measure((x, y, w, h) => {
      resolve(h);
    });
  });
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
  invisible: {
    opacity: 0,
    position: "absolute"
  },
  button: {
    color: "#888",
    marginTop: 5
  }
});
