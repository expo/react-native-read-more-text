import React from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
const VIEW_MORE_HEIGHT = 33;
export default class ReadMore extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
    fullHeight: 0,
    height: new Animated.Value(0),
    limitedHeight: 0,
  };

  async componentDidMount() {
    this._isMounted = true
    await nextFrameAsync()

    if (!this._isMounted) {
      return
    }

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._text)
    this.setState({measured: true})
    await nextFrameAsync()

    if (!this._isMounted) {
      return
    }

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text)
    if (fullHeight > limitedHeight) {
      this.state.height.setValue(limitedHeight + VIEW_MORE_HEIGHT)
      this.setState({ shouldShowReadMore: true }, () => {
        this.props.onReady && this.props.onReady()
      })
      this.setState({fullHeight: fullHeight + VIEW_MORE_HEIGHT,  limitedHeight: limitedHeight + VIEW_MORE_HEIGHT})
    } else {
      this.props.onReady && this.props.onReady()
    }
    
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    let { measured, shouldShowReadMore, limitedHeight, showAllText, height } = this.state

    let { numberOfLines } = this.props
    return (
      <Animated.View style={{height: !!limitedHeight ? height : undefined}}>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          ref={text => {
            this._text = text
          }}
        >
          {this.props.children}
        </Text>
        {shouldShowReadMore && <View style={styles.readMore}>
          {this._maybeRenderReadMore()}
        </View>}
      </Animated.View>
    )
  }

  _handlePressReadMore = () => {
    this.setState(
      { showAllText: true },
      () => {
        Animated.spring(
          this.state.height,
          {
            toValue: this.state.fullHeight
          }
        ).start();
      }
    )
    
    
  };

  _handlePressReadLess = () => {
    this.setState(
      { showAllText: false },
      () => {
        Animated.spring(
          this.state.height,
          {
            toValue: this.state.limitedHeight
          }
        ).start()
      }
    )
  };

  _maybeRenderReadMore() {
    let { shouldShowReadMore, showAllText } = this.state

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore)
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadMore}>
          Read more
        </Text>
      )
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess)
      }

      return (
        <Text style={styles.button} onPress={this._handlePressReadLess}>
          Hide
        </Text>
      )
    }
  }
}

function measureHeightAsync(component) {
  return new Promise(resolve => {
    component.measure((x, y, w, h) => {
      resolve(h)
    })
  })
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

const styles = StyleSheet.create({
  button: {
    color: '#888',
    marginTop: 5
  },
  readMore: {
    height: VIEW_MORE_HEIGHT
  }
})
