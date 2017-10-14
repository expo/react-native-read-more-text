import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  I18nManager
} from 'react-native';

export default class ReadMore extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  }

  async componentDidMount() {
    await nextFrameAsync();

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._text);
    this.setState({measured: true});
    await nextFrameAsync();

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text);

    if (fullHeight > limitedHeight) {
      this.setState({shouldShowReadMore: true}, () => {
        this.props.onReady && this.props.onReady();
      });
    }
  }

  render() {
    let {
      measured,
      showAllText,
    } = this.state;

    let {
      numberOfLines,
    } = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          style={{writingDirection: I18nManager.isRTL? 'rtl':'ltr'}}
          ref={text => { this._text = text; }}>
            <Text style={{textAlign: I18nManager.isRTL?'right':'left'}}>
              {this.props.children}
            </Text>
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    );
  }

  _handlePressReadMore = () => {
    this.setState({showAllText: true});
  }

  _handlePressReadLess = () => {
    this.setState({showAllText: false});
  }

  _maybeRenderReadMore() {
    let {
      shouldShowReadMore,
      showAllText,
    } = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadMore}>
          <Text style={{textAlign: I18nManager.isRTL?'right':'left'}}>
            {I18nManager.isRTL? 'المزيد': 'Read more'}
          </Text>
        </Text>
      )
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadLess}>
          <Text style={{textAlign: I18nManager.isRTL?'right':'left'}}>
            {I18nManager.isRTL?'اخفاء':'Hide'}
          </Text>
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
  button: {
    color: '#888',
    marginTop: 5,
    writingDirection: I18nManager.isRTL? 'rtl':'ltr'
  },
});
