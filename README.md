## @expo/react-native-read-more-text

[Try it on Expo](https://exp.host/@community/read-more-example)

![Example](https://raw.githubusercontent.com/expo/react-native-read-more-text/master/example.gif)

### Installation

```
npm i @expo/react-native-read-more-text --save
```

### Usage

```javascript
export class DescriptionCard extends React.Component {
  render() {
    let { text } = this.props;

    return (
      <View>
        <View style={styles.cardLabel}>
          <BoldText style={styles.cardLabelText}>
            Description
          </BoldText>
        </View>

        <View style={styles.card}>
          <View style={styles.cardBody}>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text style={styles.cardText}>
                {text}
              </Text>
            </ReadMore>
          </View>
        </View>
      </View>
    );
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: Colors.tintColor, marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: Colors.tintColor, marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    );
  }

  _handleTextReady = () => {
    // ...
  }
}
```
